import Ember from 'ember';
import layout from '../templates/components/record-relationship-table';

export default Ember.Component.extend({
  layout,
  actions: {
    addRelationship() {
      const scope = this;
      // recordType=relationship.type records=relationship.records relationshipName=relationship.name
      scope.get('store').findRecord(scope.get('relationship').type, scope.get('add')).then((data) => {
        if(scope.get('model').get(scope.get('relationship').name).addObject) { // hasMany
          scope.get('model').get(scope.get('relationship').name).addObject(data);
        }
        else { // belongsTo
          scope.get('model').set(scope.get('relationship').name, data);
        }
        return scope.get('model').save().then(() => {
          Ember.Logger.log('Model Saved');
          Ember.$('.uid-input').val('');
        }, (error) => {
          Ember.Logger.log(error);
          Ember.$('.uid-input').val('');
        });
      }, (error) => {
        alert(`Error: No ${scope.get('recordType')} was found with ${scope.get('add')}`);
      });
    },
    removeRelationship() {
      const scope = this;
      // recordType=relationship.type records=relationship.records relationshipName=relationship.name
      scope.get('store').findRecord(scope.get('relationship').type, scope.get('remove')).then((data) => {
        if(scope.get('model').get(scope.get('relationship').name).removeObject) { // hasMany
          scope.get('model').get(scope.get('relationship').name).removeObject(data);
        }
        else { // belongsTo
          scope.get('model').set(scope.get('relationship').name, undefined);
        }
        return scope.get('model').save().then(() => {
          Ember.Logger.log('Model Saved');
          Ember.$('.uid-input').val('');
        }, (error) => {
          Ember.Logger.log(error);
          Ember.$('.uid-input').val('');
        });
      }, (error) => {
        alert(`Error: No ${scope.get('recordType')} was found with ${scope.get('remove')}`);
      });
    }
  },
  records: Ember.computed(function() {
    return this.get('model').get(this.get('relationship').name);
  }),
  modelKeys: Ember.computed('model', function() {
    const relationshipType = this.get('relationship'),
          recordData = this.get('model').get(this.get('relationship').name);
    if (typeof recordData !== undefined && recordData.get('length') > 0)
      return Object.keys(recordData.objectAt(0).toJSON());
    else if (typeof relationshipType === "object" && recordData.content)
      return Object.keys(recordData.content.toJSON());
    return [];
  }),
  store: Ember.inject.service()
});
