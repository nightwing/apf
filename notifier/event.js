/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

define(["aml-core/amlelement", "optional!aml", "lib-oop"], function(AmlElement, aml, oop){

/**
 * Displays a popup element with a message with optionally an icon at the
 * position specified by the position attribute. After the timeout has passed
 * the popup will dissapear automatically. When the mouse hovers over the popup
 * it doesn't dissapear.
 *
 * @event click Fires when the user clicks on the representation of this event.
 */
var Event = function(struct, tagName){
    AmlElement.call(this, tagName || "event", this.NODE_HIDDEN, struct);
};

oop.inherit(Event, AmlElement);


(function() {
    this.$hasInitedWhen = false;

    this.$booleanProperties["repeat"] = true;
    this.$supportedProperties.push("when", "message", "icon", "repeat");

    this.$propHandlers["when"] = function(value) {
        if (this.$hasInitedWhen && value && this.parentNode && this.parentNode.popup) {
            var _self = this;
            $setTimeout(function() {
                _self.parentNode.popup(_self.message, _self.icon, _self);
            });
        }
        this.$hasInitedWhen = true;

        if (this.repeat)
            delete this.when;
    };

    this.$loadAml = function(x) {};
}).call(Event.prototype);

aml && aml.setElement("event", Event);

return Event;

});