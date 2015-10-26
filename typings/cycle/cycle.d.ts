/// <reference path="../rx/rx.d.ts"/>

interface ICollection<T> {
  [key: string]: T;
}

interface IObservableCollection<T> extends ICollection<Rx.Observable<T>> {}

/* 
 * The `main` function expects a collection of "driver response" Observables
 * as input, and should return a collection of "driver request" Observables.
 * A "collection of Observables" is a JavaScript object where
 * keys match the driver names registered by the `drivers` object, and values
 * are Observables or a collection of Observables.
 */
interface IMainFunction { 
  (driverResponses: IObservableCollection<any>): IObservableCollection<any> 
}

interface ICycle {
  /**
   * Takes an `main` function and circularly connects it to the given collection
   * of driver functions.
   *
   * @param {Function} main a function that takes `responses` as input
   * and outputs a collection of `requests` Observables.
   * @param {Object} drivers an object where keys are driver names and values
   * are driver functions.
   * @return {Array} an array where the first object is the collection of driver
   * requests, and the second object is the collection of driver responses, that
   * can be used for debugging or testing.
   * @function run
   */
  run(
    main: IMainFunction, 
    drivers: ICollection<Function>): Array<any>;
}

declare var Cycle: ICycle;
