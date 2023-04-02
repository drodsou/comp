export default function timezoneISOString (aDate) {
  return new Date(aDate.getTime() - (aDate.getTimezoneOffset() * 60000)).toISOString()  // pe: 2017-01-21T01:03:00.000Z, corrixido timezone
}
