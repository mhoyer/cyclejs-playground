/// <reference path="./cycle.d.ts"/>

interface IElement extends Element {
  checked: boolean;
  value: any;
}

interface IDomEvent extends Event {
  target: IElement;
}

interface IVTree {
  select(selector: string): {
    observable: Rx.Observable<any>,
    events(eventType: string): Rx.Observable<IDomEvent>
  }
}

interface ICycleDOM {
  /**
   * A factory for the DOM driver function. Takes a `container` to define the
   * target on the existing DOM which this driver will operate on. All custom
   * elements which this driver can detect should be given as the second
   * parameter. The output of this driver is a collection of Observables queried
   * with: `domDriverOutput.select(selector).events(eventType)` returns an
   * Observable of events of `eventType` happening on the element determined by
   * `selector`. Just `domDriverOutput.select(selector).observable` returns
   * an Observable of the DOM element matched by the given selector. Also,
   * `domDriverOutput.select(':root').observable` returns an Observable of
   * DOM element corresponding to the root (or container) of the app on the DOM.
   * The `events()` function also allows you to specify the `useCapture`
   * parameter of event listener. That is, the full function signature is
   * `events(eventType, useCapture)` where `useCapture` is by default `false`.
   *
   * @param {(String|HTMLElement)} container the DOM selector for the element
   * (or the element itself) to contain the rendering of the VTrees.
   * @param {Object} customElements a collection of custom element definitions.
   * The key of each property should be the tag name of the custom element, and
   * the value should be a function defining the implementation of the custom
   * element. This function follows the same contract as the top-most `main`
   * function: input are driver responses, output are requests to drivers.
   * @return {Function} the DOM driver function. The function expects an
   * Observable of VTree as input, and outputs the response object for this
   * driver, containing functions `select()` and `dispose()` that can be used
   * for debugging and testing.
   * @function makeDOMDriver
   */
  makeDOMDriver(container: any): Function;
  makeDOMDriver(container: any, customElement: any): Function;

  /**
   * A factory for the HTML driver function. Takes the registry object of all
   * custom elements as the only parameter. The HTML driver function will use
   * the custom element registry to detect custom element on the VTree and apply
   * their implementations.
   *
   * @param {Object} customElements a collection of custom element definitions.
   * The key of each property should be the tag name of the custom element, and
   * the value should be a function defining the implementation of the custom
   * element. This function follows the same contract as the top-most `main`
   * function: input are driver responses, output are requests to drivers.
   * @return {Function} the HTML driver function. The function expects an
   * Observable of Virtual DOM elements as input, and outputs an Observable of
   * strings as the HTML renderization of the virtual DOM elements.
   * @function makeHTMLDriver
   */
  makeHTMLDriver(customElements: Array<Object>): Function;
  

  /**
   * A shortcut to [virtual-hyperscript](
   * https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).
   * This is a helper for creating VTrees in Views.
   * @name h
   */
  h(...any);
  
  /**
   * An adapter around virtual-hyperscript `h()` to allow JSX to be used easily
   * with Babel. Place the [Babel configuration comment](
   * http://babeljs.io/docs/advanced/transformers/other/react/) `@jsx hJSX` at
   * the top of the ES6 file, make sure you import `hJSX` with
   * `import {hJSX} from '@cycle/dom'`, and then you can use JSX to create
   * VTrees.
   * @name hJSX
   */
  hJSX(tag: string, attrs: any);

  
  /**
   * A shortcut to the svg hyperscript function.
   * @name svg
   */
  svg();

  /**
   * A testing utility which aids in creating a queryable collection of
   * Observables. Call mockDOMResponse giving it an object specifying selectors,
   * eventTypes and their Observabls, and get as output an object following the
   * same format as the DOM Driver's response. Example:
   *
   * ```js
   * const userEvents = mockDOMResponse({
   *   '.foo': {
   *     'click': Rx.Observable.just({target: {}}),
   *     'mouseover': Rx.Observable.just({target: {}})
   *   },
   *   '.bar': {
   *     'scroll': Rx.Observable.just({target: {}})
   *   }
   * });
   *
   * // Usage
   * const click$ = userEvents.select('.foo').events('click');
   * ```
   *
   * @param {Object} mockedSelectors an object where keys are selector strings
   * and values are objects. Those nested objects have eventType strings as keys
   * and values are Observables you created.
   * @return {Object} fake DOM response object, containin a function `select()`
   * which can be used just like the DOM Driver's response. Call
   * `select(selector).events(eventType)` on the response object to get the
   * Observable you defined in the input of `mockDOMResponse`.
   * @function mockDOMResponse
   */
  mockDOMResponse();
}

declare var CycleDOM: ICycleDOM;
