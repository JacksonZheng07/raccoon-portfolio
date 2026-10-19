"use client";

import { useEffect, useState } from "react";
import { Glyph, type GlyphName } from "./glyphs";
import type { DesktopProject, WindowId } from "./types";

// Open-Meteo: free, keyless, CORS-enabled. Boston because that's where Northeastern is.
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06" +
  "&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day" +
  "&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit" +
  "&timezone=America%2FNew_York&forecast_days=2";

type Weather = {
  current: { temperature_2m: number; weather_code: number; is_day: number; time: string };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[]; is_day: number[] };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
};

function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67 || (code >= 80 && code <= 82)) return "Rain";
  if (code <= 77 || code === 85 || code === 86) return "Snow";
  return "Thunderstorms";
}

function sky(code: number, isDay: number): GlyphName {
  if (code <= 1) return isDay ? "sun" : "moon";
  if (code <= 48) return "cloud";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 86) return "snow";
  return "storm";
}

const hourFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric" });

export function WeatherWidget({ onOpenUrl }: { onOpenUrl: (url: string) => void }) {
  const forecast = () => onOpenUrl("https://www.google.com/search?igu=1&q=boston+weather");
  const [data, setData] = useState<Weather | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(WEATHER_URL, { signal: controller.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Weather>) : null))
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (data === null) {
    return (
      <section className="widget weather" aria-label="Boston weather" onClick={forecast}>
        <p className="weather-city">Boston</p>
        <p className="weather-temp">--°</p>
      </section>
    );
  }

  const { current, hourly, daily } = data;
  const start = Math.max(0, hourly.time.findIndex((t) => t > current.time));
  const hours = hourly.time.slice(start, start + 6).map((time, i) => ({
    time,
    temp: hourly.temperature_2m[start + i] ?? 0,
    code: hourly.weather_code[start + i] ?? 0,
    isDay: hourly.is_day[start + i] ?? 1,
  }));

  return (
    <section className="widget weather" data-day={current.is_day === 1} aria-label="Boston weather" onClick={forecast}>
      <div className="weather-top">
        <div>
          <p className="weather-city">Boston</p>
          <p className="weather-temp">{Math.round(current.temperature_2m)}°</p>
        </div>
        <div className="weather-now">
          <Glyph name={sky(current.weather_code, current.is_day)} />
          <p>{describe(current.weather_code)}</p>
          <p>
            H:{Math.round(daily.temperature_2m_max[0] ?? 0)}° L:{Math.round(daily.temperature_2m_min[0] ?? 0)}°
          </p>
        </div>
      </div>
      <ol className="weather-hours">
        {hours.map((h) => (
          <li key={h.time}>
            <span>{hourFormat.format(new Date(h.time)).replace(" ", "")}</span>
            <Glyph name={sky(h.code, h.isDay)} />
            <span>{Math.round(h.temp)}°</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function ProjectsWidget({
  projects,
  onOpen,
}: {
  projects: DesktopProject[];
  onOpen: (id: WindowId) => void;
}) {
  return (
    <section className="widget symbols" aria-label="My Projects">
      <h2>My Projects</h2>
      <ul>
        {projects.slice(0, 6).map((p) => (
          <li key={p.slug}>
            <button type="button" onClick={() => onOpen(`project:${p.slug}`)}>
              <span className="symbol-name">
                <strong>
                  <span className={p.priority === "Flagship" ? "up" : "flat"}>
                    <Glyph name={p.priority === "Flagship" ? "up" : "dot"} />
                  </span>
                  {p.name}
                </strong>
                <span>{p.domain}</span>
              </span>
              <span className="symbol-value">
                <strong>{monthYear.format(new Date(p.end))}</strong>
                <span className={p.priority === "Flagship" ? "up" : "flat"}>{p.priority}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

