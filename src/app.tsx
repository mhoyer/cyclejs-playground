/// <reference path="../typings/rx/rx.all.d.ts" />
/// <reference path="../typings/cycle/cycle-dom.d.ts" />

function simpleList(responses) {
    const {DOM} = responses; // destructuring assignment - w00t!
    const initialState = {
        items: ['hello', 'world'],
        newName: ''
    };

    // map DOM events to actual actions streams
    function intent(DOM : IVTree) {
        // we need to listen to input.change and button.click events
        const actions = {
            newNameChange$: DOM.select('input.new-name').events('change').map(e => e.target.value),
            addItemClick$: DOM.select('button.add-item').events('click')
        };

        return actions;
    }

    // creating a state$ stream from intent actions
    function model(actions) {
        // combine input.change and button.click stream using when-and-thenDo
        const changeAndClick$ = Rx.Observable.when(
            actions.newNameChange$
                .and(actions.addItemClick$)
                .thenDo((newNameChangeValue, addClickEv) => 
                    newNameChangeValue // we are just interested in the last value of newName change event
                )
        );

        // create state$ stream
        const state$ = changeAndClick$
            .startWith(initialState) // we need some seed state before aggregating
            .scan((prevState, newName : string) => {
                // create new state "event" from previous state and last 
                return {
                    items: prevState.items.concat(newName),
                    newName: ''
                };
            });

        return state$;
    }

    // map state$ stream to vTree$ stream
    function view(state$) {
        const vTree$ = state$.map(state =>
            <div>
                <input className="new-name" placeholder="Item name" value={state.newName} />
                <button className="add-item">Add</button>
                <ul>
                    {state.items.map(m => <li>{m}</li>)}
                </ul>
            </div>
        );

        return vTree$;
    }

    return {
        DOM: view(model(intent(DOM)))
    };
}

// wiring up the cycle
function main(responses) {
    const requests : IObservableCollection<any> = {
        DOM: simpleList(responses).DOM
    };

    return requests;
}

const drivers : ICollection<Function> = {
    DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);
