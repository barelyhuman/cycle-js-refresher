import { jsx, Fragment } from "snabbdom";

import "./index.css";
import xs from "xstream";
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import { clsx } from "./lib/class-compat";

/**
 * @param {object} sources
 * @param {import("@cycle/dom").DOMSource} sources.DOM
 * @returns
 */
function prevRep$(sources) {
  return sources.DOM.select("#prev-input")
    .events("input")
    .map((ev) => ev.target.value)
    .map((d) => Number(d))
    .startWith(0);
}

function nextEffort$(sources) {
  return sources.DOM.select("#effort-input")
    .events("input")
    .map((ev) => ev.target.value)
    .map((d) => Number(d))
    .startWith(10);
}

/**
 *
 * @param {import("xstream").Stream} state$
 */
function render$(state$) {
  return state$.map(({ prevRep, nextEffort, nextRepCount }) => {
    return (
      <div class={clsx("flex flex-col gap-10 min-w-[300px]")}>
        <form class={clsx("w-full flex flex-col gap-3")}>
          <div class={clsx("flex flex-col gap-1")}>
            <label for="" class={clsx("font-semibold")}>
              Previous Rep Count
            </label>
            <input
              name="prev"
              id="prev-input"
              class={clsx("border border-neutral-200 rounded-md")}
              placeholder="ex: 10"
              type="number"
              value={prevRep}
            />
          </div>
          <div class={clsx("flex flex-col gap-1")}>
            <label for="" class={clsx("font-semibold")}>
              Next Rep Effort <span>{nextEffort}%</span>
            </label>
            <input
              class={clsx("border border-neutral-200 rounded-md")}
              placeholder="ex: 10"
              id="effort-input"
              type="number"
              value={nextEffort}
              min="0"
              max="60"
            />
          </div>
        </form>
        <p class={clsx("text-neutral-600")}>
          Your next workout should be for:{" "}
          <span class={clsx("font-semibold text-neutral-800")}>
            {nextRepCount} reps
          </span>
        </p>
      </div>
    );
  });
}

/**
 * @param {object} sources
 * @param {import("@cycle/dom").DOMSource} sources.DOM
 * @returns
 */
function main(sources) {
  const withNextWorkout$ = xs
    .combine(prevRep$(sources), nextEffort$(sources))
    .map(([prevRep, nextEffort]) => {
      const nextRepCount = Math.ceil(prevRep + prevRep * (nextEffort / 100));
      return { prevRep, nextEffort, nextRepCount };
    });

  const vdom = render$(withNextWorkout$);

  return {
    DOM: vdom,
  };
}

const drivers = {
  DOM: makeDOMDriver("#app"),
};

run(main, drivers);
