command: "echo 'Lauching LineCalendar...'",

dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
offdayIndices: [0, 6], // Saturday & Sunday

refreshFrequency: "15min",
displayedDate: null,

getWeekNumber: function(d) {
  // Copy date so don't modify original
  //d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return weekNo;
},

render: function () {
  return "<div class=\"cal-container\">\
  <div class=\"week\"></div>\
  <div class=\"title\"></div>\
  <table>\
  <tr class=\"weekday\"></tr>\
  <tr class=\"midline\"></tr>\
  <tr class=\"date\"></tr>\
  </table>\
  </div>";
},

style: "                              \n\
  bottom: 17px                        \n\
  right: 600px                         \n\
  left: 30px                         \n\
  font-family: -apple-system          \n\
  font-size: 13px                     \n\
  font-weight: 500                    \n\
  color: #fff                         \n\
                                      \n\
  .cal-container                      \n\
    background: rgba(#000, 0)         \n\
    padding: 0px                      \n\
                                      \n\
  .title, .week                       \n\
    display: inline-block             \n\
    color: rgba(#fff, .3)             \n\
    font-size: 20px                   \n\
    font-weight: 500                  \n\
    padding-bottom: 14px              \n\
    text-transform uppercase          \n\
  .title                              \n\
    text-align: right				          \n\
    float: right                      \n\
                                      \n\
  table                               \n\
    border-collapse: collapse         \n\
    table-layout: fixed 			        \n\
    width: 100% 					            \n\
                                      \n\
  td                                  \n\
    text-align: center                \n\
                                      \n\
  .weekday td                         \n\
    padding-top: 6px                  \n\
    padding-bottom: 6px				        \n\
                                      \n\
  .date td                            \n\
    padding-top: 6px                  \n\
    padding-bottom: 6px               \n\
                                      \n\
  .today, .off-today                  \n\
    background: rgba(#fff, 0.2)       \n\
                                      \n\
  .weekday .today,                    \n\
  .weekday .off-today                 \n\
    padding-bottom: 6px 			        \n\
                                      \n\
  .date .today,                       \n\
  .date .off-today                    \n\
    padding-top: 6px 				          \n\
                                      \n\
  .midline                            \n\
    height: 3px                       \n\
    background: rgba(#fff, .5)        \n\
                                      \n\
  .midline .today                     \n\
    background: rgba(#0bf, .8)        \n\
                                      \n\
  .midline .offday                    \n\
    background: rgba(#f77, .5)        \n\
                                      \n\
  .midline .off-today                 \n\
    background: rgba(#fc3, .8)        \n\
                                      \n\
  .offday, .off-today                 \n\
    color: rgba(#f77, 1)              \n\
",

update: function (output, domEl) {
  // var date = output.split("\n"), firstWeekDay = date[0], lastDate = date[1], today = date[2], m = date[3]-1, y = date[4];

  // // DON'T MANUPULATE DOM IF NOT NEEDED
  // if(this.displayedDate != null && this.displayedDate == output) return;
  // else this.displayedDate = output;

  var date = new Date(), y = date.getFullYear(), m = date.getMonth(), today = date.getDate();

  // DON'T MANUPULATE DOM IF NOT NEEDED
  var newDate = [today, m, y].join("/");
  if(this.displayedDate != null && this.displayedDate == newDate) return;
  else this.displayedDate = newDate;

  var firstWeekDay = new Date(y, m, 1).getDay();
  var lastDate = new Date(y, m + 1, 0).getDate();

  var weekdays = "", midlines = "", dates = "";

  for (var i = 1, w = firstWeekDay; i <= lastDate; i++, w++) {
    w %= 7;
    var isToday = (i == today), isOffday = (this.offdayIndices.indexOf(w) != -1);
    var className = "ordinary";
    if(isToday && isOffday) className = "off-today";
    else if(isToday) className = "today";
    else if(isOffday) className = "offday";

    weekdays += "<td class=\""+className+"\">" + this.dayNames[w] + "</td>";
    midlines += "<td class=\""+className+"\"></td>";
    dates += "<td class=\""+className+"\">" + i + "</td>";
  };

  $(domEl).find(".week").html("Week <span style='color:lightgray'>"+this.getWeekNumber(date)+"</span>")
  $(domEl).find(".title").html(this.monthNames[m]+" <span style='color:lightgray'>"+y+"</span>");
  $(domEl).find(".weekday").html(weekdays);
  $(domEl).find(".midline").html(midlines);
  $(domEl).find(".date").html(dates);
}