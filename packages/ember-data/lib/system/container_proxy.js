/**
  This is used internally to enable deprecation of container paths and provide
  a decent message to the user indicating how to fix the issue.

  @class ContainerProxy
  @namespace DS
  @private
*/
var ContainerProxy = function (container){
  this.container = container;
};

ContainerProxy.prototype.aliasedFactory = function(path, preLookup) {
  var _this = this;

  return {create: function(){ 
    if (preLookup) { preLookup(); }

    return _this.container.lookup(path); 
  }};
};

ContainerProxy.prototype.registerAlias = function(source, dest, preLookup) {
  var factory = this.aliasedFactory(dest, preLookup);

  return this.container.register(source, factory);
};

ContainerProxy.prototype.registerDeprecation = function(deprecated, valid) {
  var preLookupCallback = function(){
    Ember.deprecate("You tried to look up '" + deprecated + "', " +
                    "but this has been deprecated in favor of '" + valid + "'.", false);
  };

  return this.registerAlias(deprecated, valid, preLookupCallback);
};

ContainerProxy.prototype.registerDeprecations = function(proxyPairs) {
  for (var i = proxyPairs.length; i > 0; i--) {
    var proxyPair = proxyPairs[i - 1],
        deprecated = proxyPair['deprecated'],
        valid = proxyPair['valid'];

    this.registerDeprecation(deprecated, valid);
  }
};

export default ContainerProxy;
