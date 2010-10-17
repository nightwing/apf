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
var XhtmlInputElement = function(struct, tagName){
    AmlElement.call(this, tagName || "input", this.NODE_VISIBLE, struct);
};

oop.inherit(XhtmlInputElement, AmlElement);


(function(){
    this.$xae = apf.XhtmlElement.prototype.$xae;
    this.$xre = apf.XhtmlElement.prototype.$xre;
    this.$propertyHandler = function(name, value, force){
        if (name == "type")
            return;

        return apf.XhtmlElement.prototype.$propertyHandler.call(this, name, value, force);
    };

    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        var pHtmlNode;
        if (!(pHtmlNode = this.parentNode.$int))
            return;

        if (this.$aml) {
            this.$ext =
            this.$int = apf.insertHtmlNode(this.$aml.serialize
                ? this.$aml
                : this.$aml.cloneNode(false), pHtmlNode);
        }
        else {
            this.$ext = this.$int = document.createElement(this.localName);
            if (this.getAttribute("type"))
                this.$int.setAttribute("type", this.getAttribute("type"));
            pHtmlNode.appendChild(this.$int);
        }
    }, true);
}).call(XhtmlInputElement.prototype);

apf.xhtml.setElement("input", apf.XhtmlInputElement);

return XhtmlInputElement;

});