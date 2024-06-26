import "./index.css";
import "./index.css"
import xs from "xstream";
import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import Snabbdom from "snabbdom-pragma";

function main(sources) {
  const effort$ = sources.DOM.select("#effort-input")
    .events("input")
    .map((ev) => ev.target.value)
    .map((d) => Number(d))
    .map((d) => d);

  const prevRev$ = sources.DOM.select("#prev-input")
    .events("input")
    .map((ev) => ev.target.value)
    .map((d) => Number(d));

  const nextWorkout$ = xs
    .combine(prevRev$.startWith(0), effort$.startWith(10))
    .map(([prevRep, nextEffort]) => {
      const nextRepCount = Math.ceil(prevRep + prevRep * (nextEffort / 100));
      return [prevRep, nextEffort, nextRepCount];
    });

  const vdom = nextWorkout$.map(([prevRep, nextEffort, nextRepCount]) => {
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

  return {
    DOM: vdom,
  };
}

const drivers = {
  DOM: makeDOMDriver("#app"),
};

run(main, drivers);
