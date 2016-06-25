!function e(t,r,o){function n(i,p){if(!r[i]){if(!t[i]){var c="function"==typeof require&&require;if(!p&&c)return c(i,!0);if(s)return s(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var u=r[i]={exports:{}};t[i][0].call(u.exports,function(e){var r=t[i][1][e];return n(r?r:e)},u,u.exports,e,t,r,o)}return r[i].exports}for(var s="function"==typeof require&&require,i=0;i<o.length;i++)n(o[i]);return n}({1:[function(e,t,r){"use strict";t.exports=function(e){var t=this,r=t.constructor;return t.callbacks={},t.directMap={},t.sequenceLevels={},t.resetTimer,t.ignoreNextKeyup=!1,t.ignoreNextKeypress=!1,t.nextExpectedAction=!1,t.element=e,t.addEvents(),r.instances.push(t),t},t.exports.prototype.bind=e("./prototype/bind"),t.exports.prototype.bindMultiple=e("./prototype/bindMultiple"),t.exports.prototype.unbind=e("./prototype/unbind"),t.exports.prototype.trigger=e("./prototype/trigger"),t.exports.prototype.reset=e("./prototype/reset.js"),t.exports.prototype.stopCallback=e("./prototype/stopCallback"),t.exports.prototype.handleKey=e("./prototype/handleKey"),t.exports.prototype.addEvents=e("./prototype/addEvents"),t.exports.prototype.bindSingle=e("./prototype/bindSingle"),t.exports.prototype.getKeyInfo=e("./prototype/getKeyInfo"),t.exports.prototype.pickBestAction=e("./prototype/pickBestAction"),t.exports.prototype.getReverseMap=e("./prototype/getReverseMap"),t.exports.prototype.getMatches=e("./prototype/getMatches"),t.exports.prototype.resetSequences=e("./prototype/resetSequences"),t.exports.prototype.fireCallback=e("./prototype/fireCallback"),t.exports.prototype.bindSequence=e("./prototype/bindSequence"),t.exports.prototype.resetSequenceTimer=e("./prototype/resetSequenceTimer"),t.exports.prototype.detach=e("./prototype/detach"),t.exports.instances=[],t.exports.reset=e("./reset"),t.exports.REVERSE_MAP=null},{"./prototype/addEvents":2,"./prototype/bind":3,"./prototype/bindMultiple":4,"./prototype/bindSequence":5,"./prototype/bindSingle":6,"./prototype/detach":7,"./prototype/fireCallback":9,"./prototype/getKeyInfo":10,"./prototype/getMatches":11,"./prototype/getReverseMap":12,"./prototype/handleKey":13,"./prototype/pickBestAction":16,"./prototype/reset.js":17,"./prototype/resetSequenceTimer":18,"./prototype/resetSequences":19,"./prototype/stopCallback":20,"./prototype/trigger":21,"./prototype/unbind":22,"./reset":23}],2:[function(e,t,r){"use strict";t.exports=function(){var t=this,r=e("./dom-event"),o=t.element;t.eventHandler=e("./handleKeyEvent").bind(t),r(o,"keypress",t.eventHandler),r(o,"keydown",t.eventHandler),r(o,"keyup",t.eventHandler)}},{"./dom-event":8,"./handleKeyEvent":14}],3:[function(e,t,r){"use strict";t.exports=function(e,t,r){var o=this;return e=e instanceof Array?e:[e],o.bindMultiple(e,t,r),o}},{}],4:[function(e,t,r){"use strict";t.exports=function(e,t,r){for(var o=this,n=0;n<e.length;++n)o.bindSingle(e[n],t,r)}},{}],5:[function(e,t,r){"use strict";t.exports=function(t,r,o,n){function s(e){return function(){p.nextExpectedAction=e,++p.sequenceLevels[t],p.resetSequenceTimer()}}function i(r){var s;p.fireCallback(o,r,t),"keyup"!==n&&(s=e("../../helpers/characterFromEvent"),p.ignoreNextKeyup=s(r)),setTimeout(function(){p.resetSequences()},10)}var p=this;p.sequenceLevels[t]=0;for(var c=0;c<r.length;++c){var a=c+1===r.length,u=a?i:s(n||p.getKeyInfo(r[c+1]).action);p.bindSingle(r[c],u,n,t,c)}}},{"../../helpers/characterFromEvent":24}],6:[function(e,t,r){"use strict";t.exports=function(e,t,r,o,n){var s=this;s.directMap[e+":"+r]=t,e=e.replace(/\s+/g," ");var i,p=e.split(" ");return p.length>1?void s.bindSequence(e,p,t,r):(i=s.getKeyInfo(e,r),s.callbacks[i.key]=s.callbacks[i.key]||[],s.getMatches(i.key,i.modifiers,{type:i.action},o,e,n),void s.callbacks[i.key][o?"unshift":"push"]({callback:t,modifiers:i.modifiers,action:i.action,seq:o,level:n,combo:e}))}},{}],7:[function(e,t,r){var o=e("./dom-event").off;t.exports=function(){var e=this,t=e.element;o(t,"keypress",e.eventHandler),o(t,"keydown",e.eventHandler),o(t,"keyup",e.eventHandler)}},{"./dom-event":8}],8:[function(e,t,r){function o(e,t,r,o){return!e.addEventListener&&(t="on"+t),(e.addEventListener||e.attachEvent).call(e,t,r,o),r}function n(e,t,r,o){return!e.removeEventListener&&(t="on"+t),(e.removeEventListener||e.detachEvent).call(e,t,r,o),r}t.exports=o,t.exports.on=o,t.exports.off=n},{}],9:[function(e,t,r){"use strict";t.exports=function(t,r,o,n){var s,i,p=this;p.stopCallback(r,r.target||r.srcElement,o,n)||t(r,o)===!1&&(s=e("../../helpers/preventDefault"),s(r),(i=e("../../helpers/stopPropagation"))(r))}},{"../../helpers/preventDefault":28,"../../helpers/stopPropagation":33}],10:[function(e,t,r){"use strict";t.exports=function(t,r){var o,n,s,i,p,c,a,u=this,l=[];for(o=e("../../helpers/keysFromString"),n=o(t),p=e("../../helpers/special-aliases"),c=e("../../helpers/shift-map"),a=e("../../helpers/isModifier"),i=0;i<n.length;++i)s=n[i],p[s]&&(s=p[s]),r&&"keypress"!==r&&c[s]&&(s=c[s],l.push("shift")),a(s)&&l.push(s);return r=u.pickBestAction(s,l,r),{key:s,modifiers:l,action:r}}},{"../../helpers/isModifier":26,"../../helpers/keysFromString":27,"../../helpers/shift-map":29,"../../helpers/special-aliases":30}],11:[function(e,t,r){"use strict";t.exports=function(t,r,o,n,s,i){var p,c,a,u,l=this,f=[],d=o.type;if("keypress"===d&&(!o.code||"Arrow"!==o.code.slice(0,5))){var y=l.callbacks["any-character"]||[];y.forEach(function(e){f.push(e)})}if(!l.callbacks[t])return f;for(a=e("../../helpers/isModifier"),"keyup"===d&&a(t)&&(r=[t]),p=0;p<l.callbacks[t].length;++p)if(c=l.callbacks[t][p],(n||!c.seq||l.sequenceLevels[c.seq]===c.level)&&d===c.action&&(u=e("./modifiersMatch"),"keypress"===d&&!o.metaKey&&!o.ctrlKey||u(r,c.modifiers))){var h=!n&&c.combo===s,x=n&&c.seq===n&&c.level===i;(h||x)&&l.callbacks[t].splice(p,1),f.push(c)}return f}},{"../../helpers/isModifier":26,"./modifiersMatch":15}],12:[function(e,t,r){"use strict";t.exports=function(){var t,r=this,o=r.constructor;if(!o.REVERSE_MAP){o.REVERSE_MAP={},t=e("../../helpers/special-keys-map");for(var n in t)n>95&&n<112||t.hasOwnProperty(n)&&(o.REVERSE_MAP[t[n]]=n)}return o.REVERSE_MAP}},{"../../helpers/special-keys-map":32}],13:[function(e,t,r){"use strict";t.exports=function(t,r,o){var n,s,i,p,c=this,a={},u=0,l=!1;for(n=c.getMatches(t,r,o),s=0;s<n.length;++s)n[s].seq&&(u=Math.max(u,n[s].level));for(s=0;s<n.length;++s)if(n[s].seq){if(n[s].level!==u)continue;l=!0,a[n[s].seq]=1,c.fireCallback(n[s].callback,o,n[s].combo,n[s].seq)}else l||c.fireCallback(n[s].callback,o,n[s].combo);p="keypress"===o.type&&c.ignoreNextKeypress,i=e("../../helpers/isModifier"),o.type!==c.nextExpectedAction||i(t)||p||c.resetSequences(a),c.ignoreNextKeypress=l&&"keydown"===o.type}},{"../../helpers/isModifier":26}],14:[function(e,t,r){"use strict";t.exports=function(t){var r,o,n=this;"number"!=typeof t.which&&(t.which=t.keyCode),r=e("../../helpers/characterFromEvent");var s=r(t);if(s){if("keyup"===t.type&&n.ignoreNextKeyup===s)return void(n.ignoreNextKeyup=!1);o=e("../../helpers/eventModifiers"),n.handleKey(s,o(t),t)}}},{"../../helpers/characterFromEvent":24,"../../helpers/eventModifiers":25}],15:[function(e,t,r){"use strict";t.exports=function(e,t){return e.sort().join(",")===t.sort().join(",")}},{}],16:[function(e,t,r){"use strict";t.exports=function(e,t,r){var o=this;return r||(r=o.getReverseMap()[e]?"keydown":"keypress"),"keypress"===r&&t.length&&(r="keydown"),r}},{}],17:[function(e,t,r){"use strict";t.exports=function(){var e=this;return e.callbacks={},e.directMap={},this}},{}],18:[function(e,t,r){"use strict";t.exports=function(){var e=this;clearTimeout(e.resetTimer),e.resetTimer=setTimeout(function(){e.resetSequences()},1e3)}},{}],19:[function(e,t,r){"use strict";t.exports=function(e){var t=this;e=e||{};var r,o=!1;for(r in t.sequenceLevels)e[r]?o=!0:t.sequenceLevels[r]=0;o||(t.nextExpectedAction=!1)}},{}],20:[function(e,t,r){"use strict";t.exports=function(e,t){if((" "+t.className+" ").indexOf(" combokeys ")>-1)return!1;var r=t.tagName.toLowerCase();return"input"===r||"select"===r||"textarea"===r||t.isContentEditable}},{}],21:[function(e,t,r){"use strict";t.exports=function(e,t){var r=this;return r.directMap[e+":"+t]&&r.directMap[e+":"+t]({},e),this}},{}],22:[function(e,t,r){"use strict";t.exports=function(e,t){var r=this;return r.bind(e,function(){},t)}},{}],23:[function(e,t,r){"use strict";t.exports=function(){var e=this;e.instances.forEach(function(e){e.reset()})}},{}],24:[function(e,t,r){"use strict";t.exports=function(t){var r,o;if(r=e("./special-keys-map"),o=e("./special-characters-map"),"keypress"===t.type){var n=String.fromCharCode(t.which);return t.shiftKey||(n=n.toLowerCase()),n}return r[t.which]?r[t.which]:o[t.which]?o[t.which]:String.fromCharCode(t.which).toLowerCase()}},{"./special-characters-map":31,"./special-keys-map":32}],25:[function(e,t,r){"use strict";t.exports=function(e){var t=[];return e.shiftKey&&t.push("shift"),e.altKey&&t.push("alt"),e.ctrlKey&&t.push("ctrl"),e.metaKey&&t.push("meta"),t}},{}],26:[function(e,t,r){"use strict";t.exports=function(e){return"shift"===e||"ctrl"===e||"alt"===e||"meta"===e}},{}],27:[function(e,t,r){"use strict";t.exports=function(e){return"+"===e?["+"]:e.split("+")}},{}],28:[function(e,t,r){"use strict";t.exports=function(e){return e.preventDefault?void e.preventDefault():void(e.returnValue=!1)}},{}],29:[function(e,t,r){"use strict";t.exports={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"}},{}],30:[function(e,t,r){"use strict";t.exports={option:"alt",command:"meta","return":"enter",escape:"esc",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"}},{}],31:[function(e,t,r){"use strict";t.exports={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"}},{}],32:[function(e,t,r){"use strict";t.exports={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",187:"plus",189:"minus",224:"meta"};for(var o=1;o<20;++o)t.exports[111+o]="f"+o;for(o=0;o<=9;++o)t.exports[o+96]=o},{}],33:[function(e,t,r){"use strict";t.exports=function(e){return e.stopPropagation?void e.stopPropagation():void(e.cancelBubble=!0)}},{}],34:[function(e,t,r){function o(e,t){return{x:e,y:t}}function n(){return"#"+Math.floor(16777215*Math.random()).toString(16)}function s(e,t){return Math.round(Math.random()*t)-e}function i(e){x.array.push(e)}function p(){return Math.random()>=.5?o(s(0,d.width),0):o(0,s(0,d.height))}var c=e("./draw"),a=e("./keyboard"),u=e("./pattern"),l=document.getElementById("menuCanvas"),f=l.getContext("2d");l.width=512,l.height=32;var f=l.getContext("2d"),d=document.getElementById("gameCanvas");d.width=512,d.height=512;var y=d.getContext("2d"),h={type:"player",pos:o(d.width/2,d.height/2),radius:5,speed:3,deinc:.1,color:"#333"},x={array:[]},v={applyPlayerSpeed:function(e){h.speed>0&&(a.up&&(e.pos.y-=h.speed),a.down&&(e.pos.y+=h.speed),a.right&&(e.pos.x+=h.speed),a.left&&(e.pos.x-=h.speed))},pytha:function(e,t){return Math.sqrt((e.x-t.x)*(e.x-t.x)+(e.y-t.y)*(e.y-t.y))},distanceCheck:function(e,t){return pytha=v.pytha(e.pos,t.pos),pytha<e.radius+t.radius},unclog:function(e,t){var r=Math.acos((e.pos.x-t.pos.x)/v.pytha(e.pos,t.pos));t.pos.x=e.pos.x-Math.cos(r)*(e.radius+t.radius),t.pos.y<e.pos.y?t.pos.y=e.pos.y-Math.sin(r)*(e.radius+t.radius):t.pos.y=e.pos.y+Math.sin(r)*(e.radius+t.radius)},squareCheck:function(e,t){return!(e.pos.x+e.radius<t.pos.x-t.radius||e.pos.y+e.radius<t.pos.y-t.radius||e.pos.x-e.radius>t.pos.x+t.radius||e.pos.y-e.radius>t.pos.y+t.radius)}},m={collision:function(e){if(e.isConnected)for(var t=0,r=x.array.length;t<r;t++){var o=x.array[t];!o.isConnected&&v.squareCheck(e,o)&&v.distanceCheck(e,o)&&(v.unclog(e,o),o.isConnected=!0,h.speed-=o.radius/120)}else v.squareCheck(h,e)&&v.distanceCheck(h,e)?(v.unclog(h,e),e.isConnected=!0,h.speed-=e.radius/120):(e.pattern(e,g),m.swapArround(e))},swapArround:function(e){e.pos.y<d.height*-.1&&(e.pos.y+=1.2*d.height),e.pos.y>1.1*d.height&&(e.pos.y-=1.2*d.height),e.pos.x>1.1*d.width&&(e.pos.x-=1.2*d.height),e.pos.x<d.width*-.1&&(e.pos.x+=1.2*d.height)}},g=-1,k={menu:function(){g++,requestAnimationFrame(k.cur)},game:function(){g++,c.clear(y,d),v.applyPlayerSpeed(h),m.swapArround(h),c.circle(y,h.pos,h.radius,h.color);for(var e=0,t=x.array.length;e<t;e++){var r=x.array[e];r.xspeed+=5e-4,r.yspeed+=5e-4,r.isConnected&&v.applyPlayerSpeed(r),m.collision(r,e),c.circle(y,r.pos,r.radius,r.color)}g%60===0&&i({pos:p(),radius:6+s(0,8),color:n(),speedpos:o(1+2*Math.random(),1+2*Math.random()),pattern:u.wavyDown}),c.clear(f,l),requestAnimationFrame(k.cur)}};k.cur=k.game,k.cur()},{"./draw":35,"./keyboard":36,"./pattern":37}],35:[function(e,t,r){t.exports={circle:function(e,t,r,o){e.fillStyle=o,e.beginPath(),e.arc(t.x,t.y,r,0,2*Math.PI),e.fill()},line:function(e,t,r,o,n){e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(r.x,r.y),e.lineWidth=o,e.strokeStyle=n,e.stroke()},clear:function(e,t){e.fillStyle="white",e.fillRect(0,0,t.width,t.height)},text:function(e,t,r,o,n){e.fillStyle=o,e.font=r.toString()+"px Helvetica",e.fillText(t,n.x,n.y)},menu:function(){}}},{}],36:[function(e,t,r){var o=e("combokeys"),n=new o(document.documentElement),s={up:!1,down:!1,left:!1,right:!1};n.bind("up",function(){s.up=!0},"keydown"),n.bind("up",function(){s.up=!1},"keyup"),n.bind("down",function(){s.down=!0},"keydown"),n.bind("down",function(){s.down=!1},"keyup"),n.bind("left",function(){s.left=!0},"keydown"),n.bind("left",function(){s.left=!1},"keyup"),n.bind("right",function(){s.right=!0},"keydown"),n.bind("right",function(){s.right=!1},"keyup"),t.exports=s},{combokeys:1}],37:[function(e,t,r){t.exports={down:function(e){e.pos.y+=e.speedpos.y},sideWays:function(e){e.pos.y+=e.speedpos.y,e.pos.x+=e.speedpos.x},wavyDown:function(e,t){e.pos.y+=e.speedpos.y+Math.sin(t/30),e.pos.x+=2*Math.sin(t/(40*e.speedpos.x))},awayFromCenter:function(e,t){}}},{}]},{},[34]);
//# sourceMappingURL=bullet.js.map
