import underscore from 'underscore';

underscore.mixin({
  compactObject(o) {
    const clone = _.clone(o);
    _.each(clone, (v, k) => {
      if (!v) {
        delete clone[k];
      }
    });
    return clone;
  },
});

export default underscore;