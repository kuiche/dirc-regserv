var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  EntrySchema
;

EntrySchema = new Schema({
  key: {type: String, required: true, unique: true, index: true},
  value: {type: String, required: true},
  token: {type: String}
});

EntrySchema.statics.public = function(entry) {
  return {key: entry.key, value: entry.value};
};

EntrySchema.methods.public = function() {
  return {key: this.key, value: this.value};
};

EntrySchema.statics.private = function(entry) {
  return {key: entry.key, value: entry.value, token: entry.token};
};

EntrySchema.methods.private = function() {
  return {key: this.key, value: this.value, token: this.token};
};

mongoose.model('Entry', EntrySchema);
