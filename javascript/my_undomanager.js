/*jslint browser: true */
/**
 * File: my_undomanager.js
 *
 * This file contains the javaScript needed for undo-redo functionality.
 * 
 *
 * Version 1.0
 * Author: Mikael Holmberg
 */
window.onload = function () {
    "use strict";

    var undoManager, 
    beers_order = [], 
    addBeer,
    undobeers,
    removeBeer,
    createBeer; 
    undoManager = new UndoManager();

    var removeBeer = function(id) {
      var i = 0, index = -1;
      for (i = 0; i < beers_order.length; i += 1) {
        if (beers_order[i].id === id) {
            index = i;
        }
    }
    if (index !== -1) {
        beers_order.splice(index, 1);
    }
};

var createBeer = function(id, beer_id, namn, price) {
// first creation
beers_order.push({"beer_id": beer_id, "namn":namn, "price":price});

// make undo-able
undoManager.add({
    undo: function() {
        removeBeer(id)
    },
    redo: function() {
        createBeer(id, beer_id, namn, price);
    }
});

}


/*
createBeer(101, 12312, "John", "32");
createBeer(102, 12312,"Mary", "42");

console.log("people", beers_order); // {101: "John", 102: "Mary"}

undoManager.undo();
console.log("people", beers_order); // {101: "John"}

undoManager.undo();
console.log("people", beers_order); // {}

undoManager.redo();
console.log("people", beers_order); // {101: "John

undoManager.redo();
console.log("people", beers_order); // {101: "John

undoManager.redo();
console.log("people", beers_order); // {101: "John

Object.keys(beers_order).forEach(function (key) {
console.log(beers_order[key].name)
}); */

};