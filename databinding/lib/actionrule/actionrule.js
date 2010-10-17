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
 * @attribute {String} match
 * @attribute {String} set
 * @attribute {String} undo
 * @attribute {String} lock
 * @define update
 * @attribute {String} get 
 * @attribute {String} parent
 * @define add
 * @attribute {Boolean} get 
 * @attribute {Boolean} parent
 */
var ActionRule = function(struct, tagName){
    AmlElement.call(this, tagName || true, this.NODE_HIDDEN, struct);
};

oop.inherit(ActionRule, AmlElement);


(function(){
    this.$actionRule = true;
    
    this.compile = function(prop, options){
        return (this["c" + prop] = apf.lm.compile(this[prop], 
            options || {xpathmode: 2}));
    }
    
    //1 = force no bind rule, 2 = force bind rule
    this.$attrExcludePropBind = Object.extend({
        set    : 1,
        get    : 1,
        undo   : 1,
        lock   : 1,
        match  : 1,
        parent : 1
    }, this.$attrExcludePropBind);

    this.$propHandlers["set"]   = 
    this.$propHandlers["get"]   = 
    this.$propHandlers["parent"]   = 
    this.$propHandlers["match"] = function(value, prop){
        delete this["c" + prop];
    }

    /**** DOM Handlers ****/

    this.addEventListener("DOMNodeInserted", function(e){
        if (e.currentTarget == this) {
            var pNode = this.parentNode;
            if (!pNode.$actions)
                pNode.$actions = new apf.ruleList();
            
            (pNode.$actions[this.localName] 
              || (pNode.$actions[this.localName] = [])).push(this);
        }
        else {
            if (this.attributes.getNamedItem("value"))
                return;
            
             //@todo apf3.0 test if proc instr and cdata needs to be serialized
            this.value = apf.serializeChildren(this);
       }
    });

    this.addEventListener("DOMNodeRemoved", function(e){
        if (this.$amlDestroyed)
            return;
        
        if (e.currentTarget == this) {
            this.parentNode.$actions[this.localName].remove(this);
        }
        else {
            if (this.attributes.getNamedItem("value"))
                return;
            
             //@todo apf3.0 test if proc instr and cdata needs to be serialized
            this.value = apf.serializeChildren(this);
       }
    });

    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        if (!this.get)
            this.get = apf.serializeChildren(this.$aml).trim();

        var actions = this.parentNode.$actions 
          || (this.parentNode.$actions = new apf.ruleList());
        
        (actions[this.localName] || (actions[this.localName] = [])).push(this);
    });
}).call(ActionRule.prototype);

aml && aml.setElement("rename", ActionRule);   
aml && aml.setElement("remove", ActionRule);
aml && aml.setElement("add",    ActionRule);
aml && aml.setElement("update", ActionRule);
aml && aml.setElement("copy",   ActionRule);
aml && aml.setElement("move",   ActionRule);
aml && aml.setElement("check",  ActionRule);
aml && aml.setElement("change", ActionRule);

return ActionRule;

});
