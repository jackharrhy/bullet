(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

module.exports = function (element) {
  var self = this
  var Combokeys = self.constructor

  /**
   * a list of all the callbacks setup via Combokeys.bind()
   *
   * @type {Object}
   */
  self.callbacks = {}

  /**
   * direct map of string combinations to callbacks used for trigger()
   *
   * @type {Object}
   */
  self.directMap = {}

  /**
   * keeps track of what level each sequence is at since multiple
   * sequences can start out with the same sequence
   *
   * @type {Object}
   */
  self.sequenceLevels = {}

  /**
   * variable to store the setTimeout call
   *
   * @type {null|number}
   */
  self.resetTimer = null

  /**
   * temporary state where we will ignore the next keyup
   *
   * @type {boolean|string}
   */
  self.ignoreNextKeyup = false

  /**
   * temporary state where we will ignore the next keypress
   *
   * @type {boolean}
   */
  self.ignoreNextKeypress = false

  /**
   * are we currently inside of a sequence?
   * type of action ("keyup" or "keydown" or "keypress") or false
   *
   * @type {boolean|string}
   */
  self.nextExpectedAction = false

  self.element = element

  self.addEvents()

  Combokeys.instances.push(self)
  return self
}

module.exports.prototype.bind = require('./prototype/bind')
module.exports.prototype.bindMultiple = require('./prototype/bindMultiple')
module.exports.prototype.unbind = require('./prototype/unbind')
module.exports.prototype.trigger = require('./prototype/trigger')
module.exports.prototype.reset = require('./prototype/reset.js')
module.exports.prototype.stopCallback = require('./prototype/stopCallback')
module.exports.prototype.handleKey = require('./prototype/handleKey')
module.exports.prototype.addEvents = require('./prototype/addEvents')
module.exports.prototype.bindSingle = require('./prototype/bindSingle')
module.exports.prototype.getKeyInfo = require('./prototype/getKeyInfo')
module.exports.prototype.pickBestAction = require('./prototype/pickBestAction')
module.exports.prototype.getReverseMap = require('./prototype/getReverseMap')
module.exports.prototype.getMatches = require('./prototype/getMatches')
module.exports.prototype.resetSequences = require('./prototype/resetSequences')
module.exports.prototype.fireCallback = require('./prototype/fireCallback')
module.exports.prototype.bindSequence = require('./prototype/bindSequence')
module.exports.prototype.resetSequenceTimer = require('./prototype/resetSequenceTimer')
module.exports.prototype.detach = require('./prototype/detach')

module.exports.instances = []
module.exports.reset = require('./reset')

/**
 * variable to store the flipped version of MAP from above
 * needed to check if we should use keypress or not when no action
 * is specified
 *
 * @type {Object|undefined}
 */
module.exports.REVERSE_MAP = null

},{"./prototype/addEvents":2,"./prototype/bind":3,"./prototype/bindMultiple":4,"./prototype/bindSequence":5,"./prototype/bindSingle":6,"./prototype/detach":7,"./prototype/fireCallback":9,"./prototype/getKeyInfo":10,"./prototype/getMatches":11,"./prototype/getReverseMap":12,"./prototype/handleKey":13,"./prototype/pickBestAction":16,"./prototype/reset.js":17,"./prototype/resetSequenceTimer":18,"./prototype/resetSequences":19,"./prototype/stopCallback":20,"./prototype/trigger":21,"./prototype/unbind":22,"./reset":23}],2:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
module.exports = function () {
  var self = this
  var on = require('./dom-event')
  var element = self.element

  self.eventHandler = require('./handleKeyEvent').bind(self)

  on(element, 'keypress', self.eventHandler)
  on(element, 'keydown', self.eventHandler)
  on(element, 'keyup', self.eventHandler)
}

},{"./dom-event":8,"./handleKeyEvent":14}],3:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * binds an event to Combokeys
 *
 * can be a single key, a combination of keys separated with +,
 * an array of keys, or a sequence of keys separated by spaces
 *
 * be sure to list the modifier keys first to make sure that the
 * correct key ends up getting bound (the last key in the pattern)
 *
 * @param {string|Array} keys
 * @param {Function} callback
 * @param {string=} action - "keypress", "keydown", or "keyup"
 * @returns void
 */
module.exports = function (keys, callback, action) {
  var self = this

  keys = keys instanceof Array ? keys : [keys]
  self.bindMultiple(keys, callback, action)
  return self
}

},{}],4:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * binds multiple combinations to the same callback
 *
 * @param {Array} combinations
 * @param {Function} callback
 * @param {string|undefined} action
 * @returns void
 */
module.exports = function (combinations, callback, action) {
  var self = this

  for (var j = 0; j < combinations.length; ++j) {
    self.bindSingle(combinations[j], callback, action)
  }
}

},{}],5:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * binds a key sequence to an event
 *
 * @param {string} combo - combo specified in bind call
 * @param {Array} keys
 * @param {Function} callback
 * @param {string=} action
 * @returns void
 */
module.exports = function (combo, keys, callback, action) {
  var self = this

  // start off by adding a sequence level record for this combination
  // and setting the level to 0
  self.sequenceLevels[combo] = 0

  /**
   * callback to increase the sequence level for this sequence and reset
   * all other sequences that were active
   *
   * @param {string} nextAction
   * @returns {Function}
   */
  function increaseSequence (nextAction) {
    return function () {
      self.nextExpectedAction = nextAction
      ++self.sequenceLevels[combo]
      self.resetSequenceTimer()
    }
  }

  /**
   * wraps the specified callback inside of another function in order
   * to reset all sequence counters as soon as this sequence is done
   *
   * @param {Event} e
   * @returns void
   */
  function callbackAndReset (e) {
    var characterFromEvent
    self.fireCallback(callback, e, combo)

    // we should ignore the next key up if the action is key down
    // or keypress.  this is so if you finish a sequence and
    // release the key the final key will not trigger a keyup
    if (action !== 'keyup') {
      characterFromEvent = require('../../helpers/characterFromEvent')
      self.ignoreNextKeyup = characterFromEvent(e)
    }

    // weird race condition if a sequence ends with the key
    // another sequence begins with
    setTimeout(
      function () {
        self.resetSequences()
      },
      10
    )
  }

  // loop through keys one at a time and bind the appropriate callback
  // function.  for any key leading up to the final one it should
  // increase the sequence. after the final, it should reset all sequences
  //
  // if an action is specified in the original bind call then that will
  // be used throughout.  otherwise we will pass the action that the
  // next key in the sequence should match.  this allows a sequence
  // to mix and match keypress and keydown events depending on which
  // ones are better suited to the key provided
  for (var j = 0; j < keys.length; ++j) {
    var isFinal = j + 1 === keys.length
    var wrappedCallback = isFinal ? callbackAndReset : increaseSequence(action || self.getKeyInfo(keys[j + 1]).action)
    self.bindSingle(keys[j], wrappedCallback, action, combo, j)
  }
}

},{"../../helpers/characterFromEvent":24}],6:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * binds a single keyboard combination
 *
 * @param {string} combination
 * @param {Function} callback
 * @param {string=} action
 * @param {string=} sequenceName - name of sequence if part of sequence
 * @param {number=} level - what part of the sequence the command is
 * @returns void
 */
module.exports = function (combination, callback, action, sequenceName, level) {
  var self = this

  // store a direct mapped reference for use with Combokeys.trigger
  self.directMap[combination + ':' + action] = callback

  // make sure multiple spaces in a row become a single space
  combination = combination.replace(/\s+/g, ' ')

  var sequence = combination.split(' ')
  var info

  // if this pattern is a sequence of keys then run through this method
  // to reprocess each pattern one key at a time
  if (sequence.length > 1) {
    self.bindSequence(combination, sequence, callback, action)
    return
  }

  info = self.getKeyInfo(combination, action)

  // make sure to initialize array if this is the first time
  // a callback is added for this key
  self.callbacks[info.key] = self.callbacks[info.key] || []

  // remove an existing match if there is one
  self.getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level)

  // add this call back to the array
  // if it is a sequence put it at the beginning
  // if not put it at the end
  //
  // this is important because the way these are processed expects
  // the sequence ones to come first
  self.callbacks[info.key][sequenceName ? 'unshift' : 'push']({
    callback: callback,
    modifiers: info.modifiers,
    action: info.action,
    seq: sequenceName,
    level: level,
    combo: combination
  })
}

},{}],7:[function(require,module,exports){
var off = require('./dom-event').off
module.exports = function () {
  var self = this
  var element = self.element

  off(element, 'keypress', self.eventHandler)
  off(element, 'keydown', self.eventHandler)
  off(element, 'keyup', self.eventHandler)
}

},{"./dom-event":8}],8:[function(require,module,exports){
module.exports = on
module.exports.on = on
module.exports.off = off

function on (element, event, callback, capture) {
  !element.addEventListener && (event = 'on' + event)
  ;(element.addEventListener || element.attachEvent).call(element, event, callback, capture)
  return callback
}

function off (element, event, callback, capture) {
  !element.removeEventListener && (event = 'on' + event)
  ;(element.removeEventListener || element.detachEvent).call(element, event, callback, capture)
  return callback
}

},{}],9:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * actually calls the callback function
 *
 * if your callback function returns false this will use the jquery
 * convention - prevent default and stop propogation on the event
 *
 * @param {Function} callback
 * @param {Event} e
 * @returns void
 */
module.exports = function (callback, e, combo, sequence) {
  var self = this
  var preventDefault
  var stopPropagation

  // if this event should not happen stop here
  if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
    return
  }

  if (callback(e, combo) === false) {
    preventDefault = require('../../helpers/preventDefault')
    preventDefault(e)
    stopPropagation = require('../../helpers/stopPropagation')
    stopPropagation(e)
  }
}

},{"../../helpers/preventDefault":28,"../../helpers/stopPropagation":33}],10:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * Gets info for a specific key combination
 *
 * @param  {string} combination key combination ("command+s" or "a" or "*")
 * @param  {string=} action
 * @returns {Object}
 */
module.exports = function (combination, action) {
  var self = this
  var keysFromString
  var keys
  var key
  var j
  var modifiers = []
  var SPECIAL_ALIASES
  var SHIFT_MAP
  var isModifier

  keysFromString = require('../../helpers/keysFromString')
  // take the keys from this pattern and figure out what the actual
  // pattern is all about
  keys = keysFromString(combination)

  SPECIAL_ALIASES = require('../../helpers/special-aliases')
  SHIFT_MAP = require('../../helpers/shift-map')
  isModifier = require('../../helpers/isModifier')
  for (j = 0; j < keys.length; ++j) {
    key = keys[j]

    // normalize key names
    if (SPECIAL_ALIASES[key]) {
      key = SPECIAL_ALIASES[key]
    }

    // if this is not a keypress event then we should
    // be smart about using shift keys
    // this will only work for US keyboards however
    if (action && action !== 'keypress' && SHIFT_MAP[key]) {
      key = SHIFT_MAP[key]
      modifiers.push('shift')
    }

    // if this key is a modifier then add it to the list of modifiers
    if (isModifier(key)) {
      modifiers.push(key)
    }
  }

  // depending on what the key combination is
  // we will try to pick the best event for it
  action = self.pickBestAction(key, modifiers, action)

  return {
    key: key,
    modifiers: modifiers,
    action: action
  }
}

},{"../../helpers/isModifier":26,"../../helpers/keysFromString":27,"../../helpers/shift-map":29,"../../helpers/special-aliases":30}],11:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * finds all callbacks that match based on the keycode, modifiers,
 * and action
 *
 * @param {string} character
 * @param {Array} modifiers
 * @param {Event|Object} e
 * @param {string=} sequenceName - name of the sequence we are looking for
 * @param {string=} combination
 * @param {number=} level
 * @returns {Array}
 */
module.exports = function (character, modifiers, e, sequenceName, combination, level) {
  var self = this
  var j
  var callback
  var matches = []
  var action = e.type
  var isModifier
  var modifiersMatch

  if (
      action === 'keypress' &&
      // Firefox fires keypress for arrows
      !(e.code && e.code.slice(0, 5) === 'Arrow')
  ) {
    // 'any-character' callbacks are only on `keypress`
    var anyCharCallbacks = self.callbacks['any-character'] || []
    anyCharCallbacks.forEach(function (callback) {
      matches.push(callback)
    })
  }

  if (!self.callbacks[character]) { return matches }

  isModifier = require('../../helpers/isModifier')
  // if a modifier key is coming up on its own we should allow it
  if (action === 'keyup' && isModifier(character)) {
    modifiers = [character]
  }

  // loop through all callbacks for the key that was pressed
  // and see if any of them match
  for (j = 0; j < self.callbacks[character].length; ++j) {
    callback = self.callbacks[character][j]

    // if a sequence name is not specified, but this is a sequence at
    // the wrong level then move onto the next match
    if (!sequenceName && callback.seq && self.sequenceLevels[callback.seq] !== callback.level) {
      continue
    }

    // if the action we are looking for doesn't match the action we got
    // then we should keep going
    if (action !== callback.action) {
      continue
    }

    // if this is a keypress event and the meta key and control key
    // are not pressed that means that we need to only look at the
    // character, otherwise check the modifiers as well
    //
    // chrome will not fire a keypress if meta or control is down
    // safari will fire a keypress if meta or meta+shift is down
    // firefox will fire a keypress if meta or control is down
    modifiersMatch = require('./modifiersMatch')
    if ((action === 'keypress' && !e.metaKey && !e.ctrlKey) || modifiersMatch(modifiers, callback.modifiers)) {
      // when you bind a combination or sequence a second time it
      // should overwrite the first one.  if a sequenceName or
      // combination is specified in this call it does just that
      //
      // @todo make deleting its own method?
      var deleteCombo = !sequenceName && callback.combo === combination
      var deleteSequence = sequenceName && callback.seq === sequenceName && callback.level === level
      if (deleteCombo || deleteSequence) {
        self.callbacks[character].splice(j, 1)
      }

      matches.push(callback)
    }
  }

  return matches
}

},{"../../helpers/isModifier":26,"./modifiersMatch":15}],12:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * reverses the map lookup so that we can look for specific keys
 * to see what can and can't use keypress
 *
 * @return {Object}
 */
module.exports = function () {
  var self = this
  var constructor = self.constructor
  var SPECIAL_KEYS_MAP

  if (!constructor.REVERSE_MAP) {
    constructor.REVERSE_MAP = {}
    SPECIAL_KEYS_MAP = require('../../helpers/special-keys-map')
    for (var key in SPECIAL_KEYS_MAP) {
      // pull out the numeric keypad from here cause keypress should
      // be able to detect the keys from the character
      if (key > 95 && key < 112) {
        continue
      }

      if (SPECIAL_KEYS_MAP.hasOwnProperty(key)) {
        constructor.REVERSE_MAP[SPECIAL_KEYS_MAP[key]] = key
      }
    }
  }
  return constructor.REVERSE_MAP
}

},{"../../helpers/special-keys-map":32}],13:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * handles a character key event
 *
 * @param {string} character
 * @param {Array} modifiers
 * @param {Event} e
 * @returns void
 */
module.exports = function (character, modifiers, e) {
  var self = this
  var callbacks
  var j
  var doNotReset = {}
  var maxLevel = 0
  var processedSequenceCallback = false
  var isModifier
  var ignoreThisKeypress

  callbacks = self.getMatches(character, modifiers, e)
  // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
  for (j = 0; j < callbacks.length; ++j) {
    if (callbacks[j].seq) {
      maxLevel = Math.max(maxLevel, callbacks[j].level)
    }
  }

  // loop through matching callbacks for this key event
  for (j = 0; j < callbacks.length; ++j) {
    // fire for all sequence callbacks
    // this is because if for example you have multiple sequences
    // bound such as "g i" and "g t" they both need to fire the
    // callback for matching g cause otherwise you can only ever
    // match the first one
    if (callbacks[j].seq) {
      // only fire callbacks for the maxLevel to prevent
      // subsequences from also firing
      //
      // for example 'a option b' should not cause 'option b' to fire
      // even though 'option b' is part of the other sequence
      //
      // any sequences that do not match here will be discarded
      // below by the resetSequences call
      if (callbacks[j].level !== maxLevel) {
        continue
      }

      processedSequenceCallback = true

      // keep a list of which sequences were matches for later
      doNotReset[callbacks[j].seq] = 1
      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo, callbacks[j].seq)
      continue
    }

    // if there were no sequence matches but we are still here
    // that means this is a regular match so we should fire that
    if (!processedSequenceCallback) {
      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo)
    }
  }

  // if the key you pressed matches the type of sequence without
  // being a modifier (ie "keyup" or "keypress") then we should
  // reset all sequences that were not matched by this event
  //
  // this is so, for example, if you have the sequence "h a t" and you
  // type "h e a r t" it does not match.  in this case the "e" will
  // cause the sequence to reset
  //
  // modifier keys are ignored because you can have a sequence
  // that contains modifiers such as "enter ctrl+space" and in most
  // cases the modifier key will be pressed before the next key
  //
  // also if you have a sequence such as "ctrl+b a" then pressing the
  // "b" key will trigger a "keypress" and a "keydown"
  //
  // the "keydown" is expected when there is a modifier, but the
  // "keypress" ends up matching the nextExpectedAction since it occurs
  // after and that causes the sequence to reset
  //
  // we ignore keypresses in a sequence that directly follow a keydown
  // for the same character
  ignoreThisKeypress = e.type === 'keypress' && self.ignoreNextKeypress
  isModifier = require('../../helpers/isModifier')
  if (e.type === self.nextExpectedAction && !isModifier(character) && !ignoreThisKeypress) {
    self.resetSequences(doNotReset)
  }

  self.ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown'
}

},{"../../helpers/isModifier":26}],14:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * handles a keydown event
 *
 * @param {Event} e
 * @returns void
 */
module.exports = function (e) {
  var self = this
  var characterFromEvent
  var eventModifiers

  // normalize e.which for key events
  // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
  if (typeof e.which !== 'number') {
    e.which = e.keyCode
  }
  characterFromEvent = require('../../helpers/characterFromEvent')
  var character = characterFromEvent(e)

  // no character found then stop
  if (character === undefined) {
    return
  }

  // need to use === for the character check because the character can be 0
  if (e.type === 'keyup' && self.ignoreNextKeyup === character) {
    self.ignoreNextKeyup = false
    return
  }

  eventModifiers = require('../../helpers/eventModifiers')
  self.handleKey(character, eventModifiers(e), e)
}

},{"../../helpers/characterFromEvent":24,"../../helpers/eventModifiers":25}],15:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * checks if two arrays are equal
 *
 * @param {Array} modifiers1
 * @param {Array} modifiers2
 * @returns {boolean}
 */
module.exports = function (modifiers1, modifiers2) {
  return modifiers1.sort().join(',') === modifiers2.sort().join(',')
}

},{}],16:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * picks the best action based on the key combination
 *
 * @param {string} key - character for key
 * @param {Array} modifiers
 * @param {string=} action passed in
 */
module.exports = function (key, modifiers, action) {
  var self = this

  // if no action was picked in we should try to pick the one
  // that we think would work best for this key
  if (!action) {
    action = self.getReverseMap()[key] ? 'keydown' : 'keypress'
  }

  // modifier keys don't work as expected with keypress,
  // switch to keydown
  if (action === 'keypress' && modifiers.length) {
    action = 'keydown'
  }

  return action
}

},{}],17:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * resets the library back to its initial state. This is useful
 * if you want to clear out the current keyboard shortcuts and bind
 * new ones - for example if you switch to another page
 *
 * @returns void
 */
module.exports = function () {
  var self = this
  self.callbacks = {}
  self.directMap = {}
  return this
}

},{}],18:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * called to set a 1 second timeout on the specified sequence
 *
 * this is so after each key press in the sequence you have 1 second
 * to press the next key before you have to start over
 *
 * @returns void
 */
module.exports = function () {
  var self = this

  clearTimeout(self.resetTimer)
  self.resetTimer = setTimeout(
    function () {
      self.resetSequences()
    },
    1000
  )
}

},{}],19:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * resets all sequence counters except for the ones passed in
 *
 * @param {Object} doNotReset
 * @returns void
 */
module.exports = function (doNotReset) {
  var self = this

  doNotReset = doNotReset || {}

  var activeSequences = false
  var key

  for (key in self.sequenceLevels) {
    if (doNotReset[key]) {
      activeSequences = true
      continue
    }
    self.sequenceLevels[key] = 0
  }

  if (!activeSequences) {
    self.nextExpectedAction = false
  }
}

},{}],20:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
* should we stop this event before firing off callbacks
*
* @param {Event} e
* @param {Element} element
* @return {boolean}
*/
module.exports = function (e, element) {
  // if the element has the class "combokeys" then no need to stop
  if ((' ' + element.className + ' ').indexOf(' combokeys ') > -1) {
    return false
  }

  var tagName = element.tagName.toLowerCase()

  // stop for input, select, and textarea
  return tagName === 'input' || tagName === 'select' || tagName === 'textarea' || element.isContentEditable
}

},{}],21:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * triggers an event that has already been bound
 *
 * @param {string} keys
 * @param {string=} action
 * @returns void
 */
module.exports = function (keys, action) {
  var self = this
  if (self.directMap[keys + ':' + action]) {
    self.directMap[keys + ':' + action]({}, keys)
  }
  return this
}

},{}],22:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * unbinds an event to Combokeys
 *
 * the unbinding sets the callback function of the specified key combo
 * to an empty function and deletes the corresponding key in the
 * directMap dict.
 *
 * TODO: actually remove this from the callbacks dictionary instead
 * of binding an empty function
 *
 * the keycombo+action has to be exactly the same as
 * it was defined in the bind method
 *
 * @param {string|Array} keys
 * @param {string} action
 * @returns void
 */
module.exports = function (keys, action) {
  var self = this

  return self.bind(keys, function () {}, action)
}

},{}],23:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

module.exports = function () {
  var self = this

  self.instances.forEach(function (combokeys) {
    combokeys.reset()
  })
}

},{}],24:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * takes the event and returns the key character
 *
 * @param {Event} e
 * @return {string}
 */
module.exports = function (e) {
  var SPECIAL_KEYS_MAP,
    SPECIAL_CHARACTERS_MAP
  SPECIAL_KEYS_MAP = require('./special-keys-map')
  SPECIAL_CHARACTERS_MAP = require('./special-characters-map')

  // for keypress events we should return the character as is
  if (e.type === 'keypress') {
    var character = String.fromCharCode(e.which)

    // if the shift key is not pressed then it is safe to assume
    // that we want the character to be lowercase.  this means if
    // you accidentally have caps lock on then your key bindings
    // will continue to work
    //
    // the only side effect that might not be desired is if you
    // bind something like 'A' cause you want to trigger an
    // event when capital A is pressed caps lock will no longer
    // trigger the event.  shift+a will though.
    if (!e.shiftKey) {
      character = character.toLowerCase()
    }

    return character
  }

  // for non keypress events the special maps are needed
  if (SPECIAL_KEYS_MAP[e.which] !== undefined) {
    return SPECIAL_KEYS_MAP[e.which]
  }

  if (SPECIAL_CHARACTERS_MAP[e.which] !== undefined) {
    return SPECIAL_CHARACTERS_MAP[e.which]
  }

  // if it is not in the special map

  // with keydown and keyup events the character seems to always
  // come in as an uppercase character whether you are pressing shift
  // or not.  we should make sure it is always lowercase for comparisons
  return String.fromCharCode(e.which).toLowerCase()
}

},{"./special-characters-map":31,"./special-keys-map":32}],25:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * takes a key event and figures out what the modifiers are
 *
 * @param {Event} e
 * @returns {Array}
 */
module.exports = function (e) {
  var modifiers = []

  if (e.shiftKey) {
    modifiers.push('shift')
  }

  if (e.altKey) {
    modifiers.push('alt')
  }

  if (e.ctrlKey) {
    modifiers.push('ctrl')
  }

  if (e.metaKey) {
    modifiers.push('meta')
  }

  return modifiers
}

},{}],26:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * determines if the keycode specified is a modifier key or not
 *
 * @param {string} key
 * @returns {boolean}
 */
module.exports = function (key) {
  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta'
}

},{}],27:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * Converts from a string key combination to an array
 *
 * @param  {string} combination like "command+shift+l"
 * @return {Array}
 */
module.exports = function (combination) {
  if (combination === '+') {
    return ['+']
  }

  return combination.split('+')
}

},{}],28:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * prevents default for this event
 *
 * @param {Event} e
 * @returns void
 */
module.exports = function (e) {
  if (e.preventDefault) {
    e.preventDefault()
    return
  }

  e.returnValue = false
}

},{}],29:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * this is a mapping of keys that require shift on a US keypad
 * back to the non shift equivelents
 *
 * this is so you can use keyup events with these keys
 *
 * note that this will only work reliably on US keyboards
 *
 * @type {Object}
 */
module.exports = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '_': '-',
  '+': '=',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
  '|': '\\'
}

},{}],30:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * this is a list of special strings you can use to map
 * to modifier keys when you specify your keyboard shortcuts
 *
 * @type {Object}
 */
module.exports = {
  'option': 'alt',
  'command': 'meta',
  'return': 'enter',
  'escape': 'esc',
  'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
}

},{}],31:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * mapping for special characters so they can support
 *
 * this dictionary is only used incase you want to bind a
 * keyup or keydown event to one of these keys
 *
 * @type {Object}
 */
module.exports = {
  106: '*',
  107: 'plus',
  109: 'minus',
  110: '.',
  111: '/',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'"
}

},{}],32:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'
/**
 * mapping of special keycodes to their corresponding keys
 *
 * everything in this dictionary cannot use keypress events
 * so it has to be here to map to the correct keycodes for
 * keyup/keydown events
 *
 * @type {Object}
 */
module.exports = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  173: 'minus',
  187: 'plus',
  189: 'minus',
  224: 'meta'
}

/**
 * loop through the f keys, f1 to f19 and add them to the map
 * programatically
 */
for (var i = 1; i < 20; ++i) {
  module.exports[111 + i] = 'f' + i
}

/**
 * loop through to map numbers on the numeric keypad
 */
for (i = 0; i <= 9; ++i) {
  module.exports[i + 96] = i
}

},{}],33:[function(require,module,exports){
/* eslint-env node, browser */
'use strict'

/**
 * stops propogation for this event
 *
 * @param {Event} e
 * @returns void
 */
module.exports = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation()
    return
  }

  e.cancelBubble = true
}

},{}],34:[function(require,module,exports){
var randInt = require('./fab/randInt');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var imgs = {
  thisIsYou: document.getElementById('imgthisIsYou')
};

module.exports = {
  getSize: function () {
    return { x: window.innerWidth, y: window.innerHeight };
  },
  getCenter: function () {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  },
  getRandomBoundPoint: function () {
    if (Math.random() >= 0.5) {
      return { x: randInt(0, window.innerWidth), y: 0 };
    }
    return { x: 0, y: randInt(0, window.innerHeight) };
  },

  resize: function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },

  hide: function () {
    canvas.style.display = 'none';
  },

  img: function (imgStr, x, y) {
    c.drawImage(imgs[imgStr], x, y);
  },

  circle: function (entity) {
    c.fillStyle = entity.color;
    c.beginPath();
    c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    c.fill();
  },

  outlineCircle: function (entity) {
    c.fillStyle = entity.color;
    c.strokeStyle = entity.strokeColor;
    c.beginPath();
    c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  },

  clear: function () {
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
  },

  text: function (pos, text, size, color) {
    c.fillStyle = color;
    c.font = size.toString() + 'px Helvetica';
    c.fillStyle(text, pos.x, pos.y);
  }
};

},{"./fab/randInt":39}],35:[function(require,module,exports){
var vec2 = require('./vec2');

var distanceCheck = require('./fab/distanceCheck');

var squareCheck = require('./fab/squareCheck');

function limit1DVel(vel, maxVel) {
  if (vel > 0) {
    return vel >= maxVel ? maxVel : vel;
  }
  return vel <= -maxVel ? -maxVel : vel;
}

function limitVel(entity) {
  return {
    x: limit1DVel(entity.vel.x, entity.maxVel.x),
    y: limit1DVel(entity.vel.y, entity.maxVel.y)
  };
}

module.exports = {
  create: function (frag) {
    return {
      radius: frag.radius || 4,
      color: frag.color || 'black',

      pos: frag.pos || { x: 0, y: 0 },
      posOffset: frag.posOffset || { x: 0, y: 0 },

      vel: frag.vel || { x: 0, y: 0 },
      maxVel: frag.maxVel || { x: 0, y: 0 },

      acel: frag.acel || { x: 0, y: 0 }
    };
  },

  basePlayer: function (center) {
    return this.create({
      radius: 5,
      color: 'white',
      outlineColor: 'black',

      pos: center,

      maxVel: { x: 3, y: 3 },
      acel: { x: 0.4, y: 0.4 }
    });
  },

  checkCollision: function (ent1, ent2) {
    return squareCheck(ent1, ent2) && distanceCheck(ent1, ent2);
  },

  acel: function (entity) {
    entity.vel.y += entity.acel.y;
    entity.vel.x += entity.acel.x;
  },

  move: function (entity) {
    entity.vel = limitVel(entity);

    entity.pos = vec2.add(entity.pos, entity.vel);
  },

  moveWithKeyboard: function (entity, keyboard) {
    if (keyboard.up) {
      entity.vel.y -= entity.acel.y;
    }
    if (keyboard.down) {
      entity.vel.y += entity.acel.y;
    }
    if (keyboard.left) {
      entity.vel.x -= entity.acel.x;
    }
    if (keyboard.right) {
      entity.vel.x += entity.acel.x;
    }

    this.move(entity);
  },

  moveWithPlayer: function (entity, basePlayer) {
    entity.pos = vec2.sub(basePlayer.pos, entity.posOffset);
  },

  swapAround: function (entity, canvasSize) {
    // Y Axis
    if (entity.pos.y > canvasSize.y) {
      entity.pos.y -= canvasSize.y;
    } else if (entity.pos.y < 0) {
      entity.pos.y += canvasSize.y;
    }

    // X Axis
    if (entity.pos.x > canvasSize.x) {
      entity.pos.x -= canvasSize.x;
    } else if (entity.pos.x < 0) {
      entity.pos.x += canvasSize.x;
    }
  }
};

},{"./fab/distanceCheck":36,"./fab/squareCheck":40,"./vec2":46}],36:[function(require,module,exports){
var pytha = require('./pytha');

module.exports = function (ent1, ent2) {
  var pythaSol = pytha(ent1.pos, ent2.pos);
  return pythaSol < ent1.radius + ent2.radius;
};

},{"./pytha":37}],37:[function(require,module,exports){
module.exports = function (pos1, pos2) {
  return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y));
};

},{}],38:[function(require,module,exports){
module.exports = function () {
  return '#' + Math.random().toString(16).substr(-6);
};

},{}],39:[function(require,module,exports){
module.exports = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

},{}],40:[function(require,module,exports){
module.exports = function (ent1, ent2) {
  return !(ent1.pos.x + ent1.radius < ent2.pos.x - ent2.radius || ent1.pos.y + ent1.radius < ent2.pos.y - ent2.radius || ent1.pos.x - ent1.radius > ent2.pos.x + ent2.radius || ent1.pos.y - ent1.radius > ent2.pos.y + ent2.radius);
};

},{}],41:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function (event) {
  var update = require('./update');

  var menu = document.getElementById('menu');
  var startButton = document.getElementById('start');
  var scoreBoards = document.getElementById('scoreBoards');

  startButton.onclick = function () {
    menu.style.display = 'none';
    scoreBoards.style.display = 'block';

    update.renderLoop();
    update.secondsLoop();
  };
});

},{"./update":45}],42:[function(require,module,exports){
var Combokeys = require('combokeys');
var canvasInput = new Combokeys(document.documentElement);

var kb = {
  up: false, down: false, left: false, right: false
};

canvasInput.bind('up', function () {
  kb.up = true;
}, 'keydown');
canvasInput.bind('up', function () {
  kb.up = false;
}, 'keyup');
canvasInput.bind('down', function () {
  kb.down = true;
}, 'keydown');
canvasInput.bind('down', function () {
  kb.down = false;
}, 'keyup');
canvasInput.bind('left', function () {
  kb.left = true;
}, 'keydown');
canvasInput.bind('left', function () {
  kb.left = false;
}, 'keyup');
canvasInput.bind('right', function () {
  kb.right = true;
}, 'keydown');
canvasInput.bind('right', function () {
  kb.right = false;
}, 'keyup');

module.exports = kb;

},{"combokeys":1}],43:[function(require,module,exports){
var dom = {
  scoreBoards: document.getElementById('scoreBoards'),
  avoidingSeconds: document.getElementById('secondsAvoided'),
  secondsLeft: document.getElementById('secondsLeft'),
  amountCollected: document.getElementById('amountCollected')
};

module.exports = {
  avoidingSeconds: 0,
  secondsLeft: 20,
  amountCollected: 0,

  updateDOM: function () {
    dom.avoidingSeconds.innerHTML = this.avoidingSeconds;
    dom.secondsLeft.innerHTML = this.secondsLeft;
    dom.amountCollected.innerHTML = this.amountCollected;
  },

  hide: function () {
    dom.scoreBoards.style.display = 'none';
  }
};

},{}],44:[function(require,module,exports){
module.exports = {
  avoiding: true,
  finished: false,

  hasMoved: false
};

},{}],45:[function(require,module,exports){
var vec2 = require('./vec2.js');
var randInt = require('./fab/randInt');
var randHex = require('./fab/randHex');

var entity = require('./entity');
var canvas = require('./canvas');
var keyboard = require('./keyboard');

var state = require('./state');

var scoreBoard = require('./scoreBoard');

var playerArray = [];
var bulletArray = [];

var frame = -1;
var seconds = -1;

canvas.resize();

var basePlayer = entity.basePlayer(canvas.getCenter());

function checkCollision(playerEntity) {
  for (var b = 0, bLen = bulletArray.length; b < bLen; b++) {
    if (bulletArray[b] && entity.checkCollision(playerEntity, bulletArray[b])) {
      let bulletToMove = bulletArray[b];

      playerArray.push(entity.create({
        radius: bulletToMove.radius,
        color: bulletToMove.color,
        pos: bulletToMove.pos,
        posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos)
      }));

      bulletArray.splice(b, 1);

      if (state.avoiding) {
        state.avoiding = false;
        document.getElementById('avoidBoard').style.opacity = '0.25';
        document.getElementById('collectBoard').style.display = 'block';
      }

      scoreBoard.amountCollected++;
      scoreBoard.updateDOM();
    }
  }
}

function renderLoop() {
  frame++;
  canvas.clear();

  var canvasSize = canvas.getSize();

  if (!state.hasMoved) {
    canvas.img('thisIsYou', canvasSize.x / 2 - 70, canvasSize.y / 2 - 123);
    if (keyboard.up || keyboard.down || keyboard.left || keyboard.right) {
      state.hasMoved = true;
    }
  }

  for (var i = 0; i < bulletArray.length; i++) {
    if (bulletArray[i]) {
      let bulletEntity = bulletArray[i];

      entity.move(bulletEntity);
      entity.acel(bulletEntity);
      entity.swapAround(bulletEntity, canvasSize);

      canvas.circle(bulletEntity);
    }
  }

  entity.moveWithKeyboard(basePlayer, keyboard);
  entity.swapAround(basePlayer, canvasSize);
  canvas.outlineCircle(basePlayer);
  checkCollision(basePlayer);

  for (var p = 0; p < playerArray.length; p++) {
    let playerEntity = playerArray[p];

    entity.moveWithPlayer(playerEntity, basePlayer);
    entity.swapAround(playerEntity, canvasSize);

    canvas.circle(playerEntity);
    checkCollision(playerEntity);
  }

  if (!state.finished) {
    window.requestAnimationFrame(renderLoop);
  }
}

function secondsLoop() {
  seconds++;

  if (state.hasMoved) {
    if (state.avoiding) {
      scoreBoard.avoidingSeconds++;
    } else {
      scoreBoard.secondsLeft--;

      if (scoreBoard.secondsLeft <= 0) {
        state.finished = true;
      }
    }

    scoreBoard.updateDOM();

    if (bulletArray.length <= 130) {
      bulletArray.push(entity.create({
        radius: randInt(7, 14),
        color: randHex(),

        pos: canvas.getRandomBoundPoint(),
        maxVel: {
          x: Math.random() * seconds / 7 + 1,
          y: Math.random() * seconds / 7 + 1
        },
        acel: {
          x: Math.random() < 0.5 ? -0.005 : 0.005,
          y: Math.random() < 0.5 ? -0.005 : 0.005
        }
      }));
    }
  }

  if (!state.finished) {
    setTimeout(secondsLoop, 1000);
    //finish();
  } else {
    finish();
  }
}

function finish() {
  scoreBoard.hide();
  canvas.hide();
  document.getElementById('menuContainer').style.display = 'none';
  document.getElementById('finish').style.display = 'block';
}

module.exports = {
  renderLoop: renderLoop,
  secondsLoop: secondsLoop
};

},{"./canvas":34,"./entity":35,"./fab/randHex":38,"./fab/randInt":39,"./keyboard":42,"./scoreBoard":43,"./state":44,"./vec2.js":46}],46:[function(require,module,exports){
function add(firstVec, secondVec) {
  return { x: firstVec.x + secondVec.x, y: firstVec.y + secondVec.y };
}

function sub(firstVec, secondVec) {
  return { x: firstVec.x - secondVec.x, y: firstVec.y - secondVec.y };
}

function multi(firstVec, secondVec) {
  return { x: firstVec.x * secondVec.x, y: firstVec.y * secondVec.y };
}

module.exports = {
  add: add,
  sub: sub,
  multi: multi
};

},{}]},{},[41])

//# sourceMappingURL=bullet.js.map
