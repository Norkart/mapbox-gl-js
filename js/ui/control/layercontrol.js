'use strict';

var Control = require('./control');
var DOM = require('../../util/dom');
var util = require('../../util/util');

module.exports = LayerControl;

/**
 * Creates a navigation control with zoom buttons and a compass
 * @class Navigation
 * @param {Object} [options]
 * @param {String} [options.position=top-right] A string indicating the control's position on the map. Options are `top-right`, `top-left`, `bottom-right`, `bottom-left`
 * @example
 * map.addControl(new mapboxgl.Navigation({position: 'top-left'})); // position is optional
 */
function LayerControl(options) {
    util.setOptions(this, options);
}

LayerControl.prototype = util.inherit(Control, {
    options: {
        position: 'top-right'
    },

    onAdd: function(map) {
        var className = 'mapboxgl-ctrl-group mapboxgl-ctrl-layer';

        var container = this._container = DOM.create('div', className, map.getContainer());
        var i, obj;
        for (i in this.options.layers) {
            obj = this.options.layers[i];
            this._addItem(obj);
        }

        return container;
    },

    _addItem: function (obj) {
        var label = document.createElement('label');

        var input = this._createRadioElement('leaflet-base-layers', obj.checked);
        input.layerId = obj.style;

        //L.DomEvent.on(input, 'click', this._onInputClick, this);
        input.addEventListener('click', this._onInputClick.bind(this));

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        label.appendChild(input);
        label.appendChild(name);

        
        this._container.appendChild(label);

        return label;
    },

    _selectStyle: function (style) {
        mapboxgl.util.getJSON(style, this._styleFetched.bind(this));
    },

    _styleFetched: function (err, style) {
        this._map.setStyle(style);
        if (this.options.styleChanged) {
            this.options.styleChanged(style);
        }
    },

    _onInputClick: function () {
        var inputs = this._container.getElementsByTagName('input');
        var input;
        for (var i = 0, len = inputs.length; i < len; i++) {
            input = inputs[i];
            if (input.checked) {
                this._selectStyle(input.layerId)
            }
        }
    },

    _createRadioElement: function (name, checked) {

        var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
                name + '"' + (checked ? ' checked="checked"' : '') + '/>';

        var radioFragment = document.createElement('div');
        radioFragment.innerHTML = radioHtml;

        return radioFragment.firstChild;
    },
});
