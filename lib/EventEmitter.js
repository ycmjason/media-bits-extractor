function EventEmitter(){
  this.eventHandlers = {}; 
}

EventEmitter.prototype.emit = function(eventname, data){
  var handler = this.eventHandlers[eventname];
  if(handler) handler(data);
};

EventEmitter.prototype.on = function(eventname, handler){
  if(typeof handler !== "function") throw "EventEmitter: handler not a function";
  this.eventHandlers[eventname] = handler;
};

module.exports = EventEmitter;
