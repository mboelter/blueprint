module.exports.slug = function(s) {
  return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};