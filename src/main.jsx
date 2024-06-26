import "./index.css";
import "./index.css";
import xs from "xstream";
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import Snabbdom from "snabbdom-pragma";

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
      <div className="flex flex-col gap-10 min-w-[300px]">
        <form className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label for="" className="font-semibold">
              Previous Rep Count
            </label>
            <input
              name="prev"
              id="prev-input"
              className="border border-neutral-200 rounded-md"
              placeholder="ex: 10"
              value={prevRep}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label for="" className="font-semibold">
              Next Rep Effort <span>{nextEffort}%</span>
            </label>
            <input
              className="border border-neutral-200 rounded-md"
              placeholder="ex: 10"
              id="effort-input"
              type="number"
              value={nextEffort}
              min="0"
              max="60"
            />
          </div>
        </form>
        <p className="text-neutral-600">
          Your next workout should be for:{" "}
          <span className="font-semibold text-neutral-800">
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
