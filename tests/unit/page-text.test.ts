import { describe, expect, it } from "vitest";
import { parsePageText, splitMarked } from "../../lib/page-text";

const parse = (body: string) => parsePageText("test.txt", body);

describe("parsePageText", () => {
  it("reads a key and the block under it", () => {
    const text = parse("[hero.heading]\ni take things apart.\n");
    expect(text("hero.heading")).toBe("i take things apart.");
  });

  /*
   * The whole point of choosing this format over JSON: the file should be
   * wrappable to a comfortable column without that wrapping reaching the
   * page. A single newline is whitespace, exactly as it is in HTML.
   */
  it("collapses hard wrapping into spaces", () => {
    const text = parse(
      "[hero.intro]\nTen builds, opened up with the parts\nstill lying on the table.\n",
    );
    expect(text("hero.intro")).toBe(
      "Ten builds, opened up with the parts still lying on the table.",
    );
  });

  it("keeps a blank line as a paragraph break", () => {
    const text = parse(
      "[about.body]\nFirst paragraph, which\nwraps.\n\nSecond paragraph.\n",
    );
    expect(text.paragraphs("about.body")).toEqual([
      "First paragraph, which wraps.",
      "Second paragraph.",
    ]);
    /* Read as one string, the paragraphs are still separated. */
    expect(text("about.body")).toBe(
      "First paragraph, which wraps.\n\nSecond paragraph.",
    );
  });

  it("treats a single-paragraph block as one paragraph", () => {
    const text = parse("[a.b]\njust the one.\n");
    expect(text.paragraphs("a.b")).toEqual(["just the one."]);
  });

  it("ignores comment lines and blank space between blocks", () => {
    const text = parse(
      "# a note to the editor\n\n[a.b]\nvalue\n\n# another note\n\n[c.d]\nother\n",
    );
    expect(text("a.b")).toBe("value");
    expect(text("c.d")).toBe("other");
  });

  it("does not treat a # inside a block as a comment", () => {
    /* Prose is allowed to contain a hash; only a line that starts with one
       and sits outside a block is an editor's note. */
    const text = parse("[a.b]\nfiled under #3, the awkward one\n");
    expect(text("a.b")).toBe("filed under #3, the awkward one");
  });

  it("accepts a numbered row key", () => {
    /* Repeated rows are `observations.1.theme`, not a key per field. */
    const text = parse("[observations.1.theme]\nReliable systems\n");
    expect(text("observations.1.theme")).toBe("Reliable systems");
  });

  it("keeps every key it was given", () => {
    const text = parse("[a.b]\none\n\n[c.d]\ntwo\n\n[e.f]\nthree\n");
    expect(text.keys()).toEqual(["a.b", "c.d", "e.f"]);
  });

  /*
   * Every failure below is a build failure by design. The alternative is a
   * live portfolio rendering an empty headline because a key was misspelt,
   * which is strictly worse than a build that refuses to finish.
   */
  describe("refuses malformed content", () => {
    it("rejects a duplicate key", () => {
      expect(() => parse("[a.b]\none\n\n[a.b]\ntwo\n")).toThrow(
        /test\.txt.*duplicate.*a\.b/i,
      );
    });

    it("rejects an empty block", () => {
      expect(() => parse("[a.b]\n\n[c.d]\ntwo\n")).toThrow(
        /test\.txt.*a\.b.*empty/i,
      );
    });

    it("rejects content before the first key", () => {
      expect(() => parse("stray prose\n\n[a.b]\none\n")).toThrow(
        /test\.txt.*before the first key/i,
      );
    });

    it("rejects a key that is not dotted lowercase", () => {
      expect(() => parse("[Hero Heading]\nvalue\n")).toThrow(
        /test\.txt.*Hero Heading/,
      );
    });

    it("rejects a file with no keys at all", () => {
      expect(() => parse("# only a comment\n")).toThrow(/test\.txt.*no keys/i);
    });
  });

  describe("refuses to look up what is not there", () => {
    it("throws on a missing key, and names the file", () => {
      const text = parse("[a.b]\none\n");
      expect(() => text("a.c")).toThrow(/test\.txt.*a\.c/);
    });

    /*
     * The error names what IS defined. A typo is the likeliest cause, and a
     * list of the real keys turns a stack trace into a fix.
     */
    it("lists the keys it does have", () => {
      const text = parse("[hero.heading]\none\n\n[hero.intro]\ntwo\n");
      expect(() => text("hero.headline")).toThrow(/hero\.heading, hero\.intro/);
    });

    it("throws on a missing key through paragraphs too", () => {
      const text = parse("[a.b]\none\n");
      expect(() => text.paragraphs("nope")).toThrow(/test\.txt.*nope/);
    });
  });
});

describe("splitMarked", () => {
  it("splits an emphasised word out of a headline", () => {
    expect(splitMarked("i take things *apart* to see how they work.")).toEqual([
      { text: "i take things ", mark: false },
      { text: "apart", mark: true },
      { text: " to see how they work.", mark: false },
    ]);
  });

  it("handles emphasis at either end", () => {
    expect(splitMarked("*first* word")).toEqual([
      { text: "first", mark: true },
      { text: " word", mark: false },
    ]);
    expect(splitMarked("last *word*")).toEqual([
      { text: "last ", mark: false },
      { text: "word", mark: true },
    ]);
  });

  it("passes plain text through as a single unmarked run", () => {
    expect(splitMarked("nothing emphasised")).toEqual([
      { text: "nothing emphasised", mark: false },
    ]);
  });

  /*
   * One pair, and only one. Two would mean the headline has two emphases,
   * which the design does not have a treatment for, and an unclosed marker
   * is a typo that would otherwise render a literal asterisk on the page.
   */
  it("rejects an unclosed marker", () => {
    expect(() => splitMarked("i take things *apart")).toThrow(/unclosed/i);
  });

  it("rejects more than one emphasis", () => {
    expect(() => splitMarked("*one* and *two*")).toThrow(/one emphasis/i);
  });
});
