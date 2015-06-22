define(['backbone', 'underscore'], function (Backbone, _) {
    "use strict";

    /**
     * Replaces properties and methods of class by condition.
     * @param {Function|Boolean} [condition=true] If the condition is true, properties will be replaced. You can pass
     * a function which should return the condition.
     * @param {Object|Function} replacement Object, which properties will be used as replacement for the same properties
     * of original class.
     * If function will be passed, it should return Object - replacement. The only argument that will be passed into the
     * function is original prototype.
     * @return {Function} this
     * @example The simplest case
     * <code class="javascript">
     * var Block = Backbone.View.extend({
     *     initialize: function(){
     *         this.initHandlers();
     *     },
     *
     *     initHandlers: function(){
     *         console.log('init handlers');
     *         this.$el.on('click', some_function);
     *     }
     * });
     *
     * var MobileBlock = Block.redefine({
     *     initHandlers: function(){
     *         console.log('init handlers for mobile devices');
     *         this.$el.on('touchstart', some_function);
     *     }
     * });
     *
     * MobileBlock === Block; // true, MobileBlock - alias for dics
     *
     * var instance = new Block;  // logs 'init handlers for mobile devices'
     * </code>
     *
     * @example Use origin method into the redefined
     * <code class="javascript">
     * var Origin = Backbone.View.extend({
     *     method: function(){
     *         console.log('origin method');
     *     }
     * });
     *
     * Origin.redefine(function(origin){return {
     *     method: function(){
     *         origin.method.call(this);
     *         console.log('redefined method');
     *     }
     * }});
     *
     * var instance = new Origin;
     * instance.method();         // logs 'origin method' and 'redefined method'
     * </code>
     *
     * @example Redefine by condition
     * <code class="javascript">
     * var Block = Backbone.View.extend({
     *     initialize: function(){
     *         this.initHandlers();
     *     },
     *
     *     initHandlers: function(){
     *         console.log('init handlers');
     *         this.$el.on('click', some_function);
     *     }
     * });
     *
     * var MOBILE_DEVICE = true;
     * var MobileBlock = Block.redefine(MOBILE_DEVICE, {
     *     initHandlers: function(){
     *         console.log('init handlers for mobile devices');
     *         this.$el.on('touchstart', some_function);
     *     }
     * });
     * </code>
     */
    var redefine = function(condition, replacement){
        if (!replacement) {
            replacement = condition;
            condition = true;
        }

        if (typeof condition == 'function') {
            condition = condition();
        }

        if (!condition) {
            return this;
        }

        if (typeof replacement == 'function') {
            var origin = {};
            replacement = replacement(origin);
            for (var prop in replacement) {
                if (replacement.hasOwnProperty(prop)) {
                    origin[prop] = this.prototype[prop];
                }
            }
        }

        _.extend(this.prototype, replacement);
        return this;
    };

    Backbone.Model.redefine = Backbone.Collection.redefine = Backbone.Router.redefine = Backbone.View.redefine = Backbone.History.redefine = redefine;
});
