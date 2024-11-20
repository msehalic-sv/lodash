/**
 * Extracts the unwrapped value from its wrapper.
 *
 * @private
 * @param {Object} wrapper The wrapper to unwrap.
 * @returns {*} Returns the unwrapped value.
 */
function getUnwrappedValue(wrapper) {
    let index = -1;
    const actions = wrapper.__actions__;
    const length = actions.length;
    let result = wrapper.__wrapped__;

    while (++index < length) {
        const args = [result];
        const action = actions[index];

        push.apply(args, action.args);
        result = action.func.apply(action.thisArg, args);
    }
    return result;
}

/** The file path of the lodash file to test. */
const filePath = (function () {
    let min = 2;
    let result = params || [];

    if (phantom) {
        min = 0;
        result = params = phantom.args || require('system').args;

        return result
    }
    const last = result[result.length - 1];
    result =
        result.length > min && !/test(?:\.js)?$/.test(last)
            ? last
            : '../node_modules/lodash/lodash';

    if (!amd) {
        try {
            result = require('fs').realpathSync(result);
        } catch (e) {}
    }

    if (!result) {
        return {error: 'No results'};
    }
    return result;
})();


/**
 * Converts `array` to an `arguments` object.
 *
 * @private
 * @param {Array} array The array to convert.
 * @returns {Object} Returns the converted `arguments` object.
 */
function toArgs(array) {
    return function () {
        return arguments;
    }.apply(undefined, array);
}



// Add other realm values from an iframe.
lodashStable.attempt(() => {
    _._realm = realm;

    const iframe = document.createElement('iframe');
    iframe.frameBorder = iframe.height = iframe.width = 0;
    body.appendChild(iframe);

    var idoc = (idoc = iframe.contentDocument || iframe.contentWindow).document || idoc;
    idoc.write(
        [
            '<html>',
            '<body>',
            '<script>',
            'var _ = parent._,',
            '    noop = function() {},',
            '    root = this;',
            '',
            'var object = {',
            "  'ArrayBuffer': root.ArrayBuffer,",
            "  'arguments': (function() { return arguments; }(1, 2, 3)),",
            "  'array': [1],",
            "  'arrayBuffer': root.ArrayBuffer ? new root.ArrayBuffer : undefined,",
            "  'boolean': Object(false),",
            "  'date': new Date,",
            "  'element': document.body,",
            "  'errors': [new Error, new EvalError, new RangeError, new ReferenceError, new SyntaxError, new TypeError, new URIError],",
            "  'function': noop,",
            "  'map': root.Map ? new root.Map : undefined,",
            "  'nan': NaN,",
            "  'null': null,",
            "  'number': Object(0),",
            "  'object': { 'a': 1 },",
            "  'promise': root.Promise ? Promise.resolve(1) : undefined,",
            "  'regexp': /x/,",
            "  'set': root.Set ? new root.Set : undefined,",
            "  'string': Object('a'),",
            "  'symbol': root.Symbol ? root.Symbol() : undefined,",
            "  'undefined': undefined,",
            "  'weakMap': root.WeakMap ? new root.WeakMap : undefined,",
            "  'weakSet': root.WeakSet ? new root.WeakSet : undefined",
            '};',
            '',
            `_.each(['${arrayViews.join("', '")}'], function(type) {`,
            '  var Ctor = root[type];',
            '  object[type] = Ctor;',
            '  object[type.toLowerCase()] = Ctor ? new Ctor(new ArrayBuffer(24)) : undefined;',
            '});',
            '',
            '_.assign(_._realm, object);',
            '</script>',
            '</body>',
            '</html>',
        ].join('\n'),
    );

    idoc.close();
    delete _._realm;
});