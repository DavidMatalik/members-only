const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const MessageSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

MessageSchema.virtual('createdAt_formatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
})

MessageSchema.virtual('url').get(function () {
  return '/messages/' + this._id
})

module.exports = mongoose.model('Message', MessageSchema)
