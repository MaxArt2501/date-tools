// Module definition template fromCharCode
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.DateTools = factory();
    }
}(this, function () {

var aslice = Array.prototype.slice;

var DateTools = {
    /**
     * Checks if a year is leap.
     * @param {Number|Date} year If a Date object is given, year.getFullYear() is used
     * @returns {Boolean}
     */
    isLeapYear: function(year) {
        var y = year instanceof Date ? year.getFullYear() : +year;
        return !(y & 3) && (!(y % 25) || !(y & 15));
    },

    /**
     * Checks if two dates represent the same day.
     * @param {Date} date1
     * @param {Date} date2
     * @returns {Boolean}
     */
    isSameDay: function(date1, date2) {
        return date1.getFullYear() === date2.getFullYear()
                && date1.getMonth() === date2.getMonth()
                && date1.getDate() === date2.getDate();
    },

    /**
     * Returns a Date object representing the Easter for the given year.
     * @param {Number|Date} year
     * @returns {Date}
     */
    getEaster: function(year) {
        var k = year/100 | 0,
            a = ~~k * 1483 - ~~(k >> 2) * 2225 + 2613,
            b = ~~((year % 19 * 3510 + ~~(a / 25) * 319) / 330) % 29,
            d = 56 - b - (~~(year * 1.25) + a - b) % 7;
        return new Date(year, 2 + (d > 31), d > 31 ? d - 31 : d);
    },

    /**
     * Checks if a Date object is an Easter date.
     * @param {Date} date
     * @returns {Boolean}
     */
    isEaster: function(date) {
        if (date.getDay()) return false;
        var month = date.getMonth(), day, year, easter;
        if (month < 2 || month > 3) return false;
        day = date.getDate();
        if (month === 2 && day < 22 || month === 3 && day > 25) return false;
        easter = this.getEaster(date.getFullYear());
        return easter.getMonth() === month && easter.getDate() === day;
    },

    /**
     * Returns the ordinal date of a Date object (i.e., the number of days
     * since January 1st of the same year, plus one).
     * @param {Date} date
     * @returns {Number}   Ranging 0-365
     */
    getOrdinalDate: function(date) {
        var ys = new Date(date.getFullYear(), 0, 1);
        return 1 + Math.floor((date.getTime() - ys.getTime()
            + (ys.getTimezoneOffset() - date.getTimezoneOffset())*6e4)/864e5);
    },

    /**
     * Returns the year as per ISO standard.
     * @param {Date} date
     * @returns {Number}
     */
    getISOYear: function(date) {
        var m = date.getMonth(), y = date.getFullYear(), d;
        if (m && m < 11) return y;
        d = date.getDate();
        return  m ? (y + (d > 28 && d - (date.getDay() || 7) > 27))
                : (y - (d < 4 && d + 3 < (date.getDay() || 7)));
    },

    /**
     * Returns the number of the week for a given date, as per ISO standard
     * @param {Date} date
     * @returns {Number}
     */
    getWeek: function(date) {
        var yr = date.getFullYear(),
            tday = new Date(yr, date.getMonth(), date.getDate()),
            ts = tday.setDate(tday.getDate() + 4 - (tday.getDay() || 7)),
            ftday = new Date(tday.getFullYear(), 0, 4);
        return Math.floor((ts - ftday.setDate(ftday.getDate() + 4 - (ftday.getDay() || 7))
                + (ftday.getTimezoneOffset() - tday.getTimezoneOffset())*6e4) / 6048e5) + 1;
    },
    /**
     * Sets the number of the week, keeping the day of the week, for
     * a given date, as per ISO standard. The original date is modified.
     * @param {Date} date
     * @param {Number} week  Ranging 1-52/53 for a year
     * @returns {Number}     Timestamp of the modified date
     */
    setWeek: function(date, week) {
        return date.setDate(date.getDate() + (week - this.getWeek(date))*7);
    },
    /**
     * Returns the day of the week for a given date, as per ISO standard.
     * @param {Date} date
     * @returns {Number}     Ranging 1 (Monday) - 7 (Sunday)
     */
    getISODay: function(date) {return date.getDay() || 7;},

    /**
     * Sets the day of the week for a given date. The original date is modified.
     * @param {Date} date
     * @param {Number} day   Ranging 0-6
     * @returns {Number}     Timestamp of the modified date
     */
    setDay: function(date, day) {
        return date.setDate(date.getDate() + day - date.getDay());
    },

    /**
     * Sets the day of the week for a given date, as per ISO standard.
     * The original date is modified.
     * @param {Date} date
     * @param {Number} day   Ranging 1-7
     * @returns {Number}     Timestamp of the modified date
     */
    setISODay: function(date, day) {
        return date.setDate(date.getDate() + day - (date.getDay() || 7));
    },

    /**
     * Returns the amount of days in the month of a given date.
     * @param {Date} date
     * @returns {Number}
     */
    getMonthLength: function(date) {
        var m = date.getMonth();
        return m === 1 ? 28 + this.isLeapYear(date)
                : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    },

    /**
     * Returns the name of the month for a given date.
     * @param {Date} date
     * @param {String} [locale]  Locale identifier
     * @returns {String}
     */
    getMonthName: function(date, locale) {
        return (locale && this.i18n[locale] || _locale).months[date.getMonth()];
    },

    /**
     * Returns the shortened name of the month for a given date.
     * @param {Date} date
     * @param {String} [locale]  Locale identifier
     * @returns {String}
     */
    getMonthShortName: function(date, locale) {
        return (locale && this.i18n[locale] || _locale).monthsShort[date.getMonth()];
    },

    /**
     * Returns the name of the day of the week for a given date.
     * @param {Date} date
     * @param {String} [locale]  Locale identifier
     * @returns {String}
     */
    getDayName: function(date, locale) {
        return (locale && this.i18n[locale] || _locale).days[date.getDay()];
    },

    /**
     * Returns the shortened name of the day of the week for a given date.
     * @param {Date} date
     * @param {String} [locale]  Locale identifier
     * @returns {String}
     */
    getDayShortName: function(date, locale) {
        return (locale && this.i18n[locale] || _locale).daysShort[date.getDay()];
    },

    /**
     * Returns the amount of milliseconds since midnight of a given date.
     * @param {Date} date
     * @returns {Number}
     */
    getDailyTime: function(date) {return (date.getTime() - date.getTimezoneOffset()*6e4) % 864e5;},

    /**
     * Returns the number of minutes of difference respect a normal day for a
     * given date due to Daylight Saving Time change
     * @param {Date} date
     * @returns {Number}
     */
    getDSTChange: function(date) {
        var dh = new Date(date.getTime()), tz;
        dh.setHours(0, 0, 0, 0);
        tz = dh.getTimezoneOffset();
        dh.setHours(24);
        return dh.getTimezoneOffset() - tz;
    },

    /**
     * Returns the istant the Daylight Saving Time change happens in a given date.
     * If no change happens for the date, it returns the timestamp of the midnight.
     * @param {Date} date
     * @returns {Number}
     */
    getDSTChangeTime: function(date) {
        var ts = date.getTime(),
            dh = new Date(ts),
            ts1, ts2, ts,
            tzo1, tzo2, tzo,
            chunk = 9e5; // 15 minutes
        dh.setHours(0, 0, 0, 0);
        ts1 = dh.getTime();
        tzo1 = dh.getTimezoneOffset();
        dh.setHours(24);
        tzo2 = dh.getTimezoneOffset();
        if (tzo1 === tzo2) return ts1;
        ts2 = dh.getTime();

        // Binary search for the DSY change rounded to 15 minutes
        while (ts2 - ts1 > chunk) {
            ts = Math.floor((ts1 + ts2) / (chunk << 1)) * chunk;
            dh.setTime(ts);
            tzo = dh.getTimezoneOffset();
            if (tzo === tzo1) ts1 = ts;
            else ts2 = ts;
        }
        return ts2;
    },

    /**
     * Shift a given date by a certain amount of milliseconds, or
     * years/months/days/hours/minutes/seconds/milliseconds (if more than
     * one argument is given). The original date is modified.
     * @param {Number} years     Adds that amount of years to the given date.
     *                           But if it's the only argument, it's considered the
     *                           amount of milliseconds to add to getTime instead.
     * @param {Number} [months]
     * @param {Number} [days]
     * @param {Number} [hours]
     * @param {Number} [minutes]
     * @param {Number} [seconds]
     * @param {Number} [millis]
     * @returns {Number}         The shifted date.getTime()
     */
    shift: function(date, years, months, days, hours, minutes, seconds, millis) {
        var al = arguments.length;
        if (al < 2) return date.setTime(date.getTime() + (+years));
        date.setFullYear(date.getFullYear() + (+years));
        date.setMonth(date.getMonth() + (+months));
        if (al > 2) date.setDate(date.getDate() + (+days));
        if (al > 3) date.setHours(date.getHours() + (+hours));
        if (al > 4) date.setMinutes(date.getMinutes() + (+minutes));
        if (al > 5) date.setSeconds(date.getSeconds() + (+seconds));
        if (al > 6) date.setMilliseconds(date.getMilliseconds() + (+millis));
        return date.getTime();
    },

    /**
     * Clones a date object, plus it takes extra arguments to shift it
     * just like .shift
     * @param {Number} years     Adds that amount of years to the cloned date.
     *                           But if it's the only argument, it's considered the
     *                           amount of milliseconds to add to getTime instead.
     * @param {Number} [months]
     * @param {Number} [days]
     * @param {Number} [hours]
     * @param {Number} [minutes]
     * @param {Number} [seconds]
     * @param {Number} [millis]
     * @returns {Date}           The cloned date
     */
    clone: function(date) {
        var d = new Date(date.getTime());
        if (arguments.length > 1)
            this.shift.apply(this, [d].concat(aslice(arguments, 1)));
        return d;
    },

    /**
     * Formats a date object, using a given formatting string and an optional
     * language set.
     * @param {Date} date
     * @param {String} format   The formatting string
     * @param {String} [lang]   The language identifier
     * @returns {String}         The formatted date
     *
     * The formatting string can be built in the same manner of PHP's date
     * function, plus some other codes. Each letter can be escaped with a
     * backslash, so it won't interpreted as a formatting code. Moreover,
     * literal strings can be included when enclosed in single or double
     * quotation marks.
     */
    format: function(date, format, locale) {
        if (isNaN(date)) return "";
        var langObj = locale && this.i18n[locale] || _locale;
        for (var i = 0, l = format.length, t = "", c, j; i < l; i++) {
            if ((c = format.charAt(i)) === "\\") {
                t += format.charAt(++i);
                continue;
            }
            if (c === "\"" && (j = format.indexOf("\"", i + 1)) !== -1) {
                t += format.substring(i + 1, i = j);
                continue;
            }
            if (c === "'" && (j = format.indexOf("'", i + 1)) !== -1) {
                t += format.substring(i + 1, i = j);
                continue;
            }
            switch (c) {
                case "Y": t += date.getFullYear(); break;
                case "o": t += this.getISOYear(date); break;
                case "y": t += String(date.getFullYear()).substring(2); break;
                case "L": t += this.isLeapYear(date) ? "1" : "0"; break;
                case "F": t += langObj.months[date.getMonth()]; break;
                case "M": t += langObj.monthsShort[date.getMonth()]; break;
                case "Q": t += lang.monthsShort[this.getMonth()].charAt(0); break;
                case "m": t += String(date.getMonth() + 101).substring(1); break;
                case "n": t += date.getMonth() + 1; break;
                case "t": t += this.getMonthLength(date); break;
                case "W": t += ("0" + this.getWeek(date)).slice(-2); break;
                case "D": t += langObj.daysShort[date.getDay()]; break;
                case "l": t += langObj.days[date.getDay()]; break;
                case "x": t += langObj.daysShort[date.getDay()].charAt(0); break;
                case "N": t += date.getDay() || 7; break;
                case "w": t += date.getDay(); break;
                case "z": t += this.getOrdinalDate(date) - 1; break;
                case "d": t += ("0" + date.getDate()).slice(-2); break;
                case "j": t += date.getDate(); break;
                case "h": t += ("0" + (date.getHours()%12 || 12)).slice(-2); break;
                case "g": t += date.getHours()%12 || 12; break;
                case "H": t += ("0" + date.getHours()).slice(-2); break;
                case "G": t += date.getHours(); break;
                case "i": t += ("0" + date.getMinutes()).slice(-2); break;
                case "s": t += ("0" + date.getSeconds()).slice(-2); break;
                case "k": t += ("00" + date.getMilliseconds()).slice(-3); break;
                case "u": t += ("00" + date.getMilliseconds()).slice(-3) + "000"; break;
                case "A": t += date.getHours() > 11 ? "PM" : "AM"; break;
                case "a": t += date.getHours() > 11 ? "pm" : "am"; break;
                case "O":
                    c = date.getTimezoneOffset();
                    t += (c < 0 ? "+" : "-") + ("000" + (Math.floor(Math.abs(c)/60)*100 + (Math.abs(c)%60))).slice(-4);
                    break;
                case "P":
                    c = date.getTimezoneOffset();
                    c = ("0" + Math.floor(Math.abs(c)/60)).slice(-2) + ":" + ("0" + Math.abs(c)%60).slice(-2);
                    t += (c < 0 ? "+" : "-")  +  c;
                    break;
                case "Z": t += date.getTimezoneOffset()*60; break;
                case "c": t += this.format(date, this.ISO_8601, locale); break;
                case "r": t += this.format(date, this.RFC_2822, locale); break;
                case "U": t += Math.floor(date.getTime()/1e3); break;
                case "T":
                    c = date.getTimezoneOffset();
                    for (j = 0; j < langObj.timezones.length; j++)
                        if (Date.timezones[langObj.timezones[j]] === c) {t += langObj.timezones[j]; break;}
                    if (j === langObj.timezones.length)
                        t += "UTC" + (c < 0 ? "+" : "-") + ("000" + (Math.floor(Math.abs(c)/60)*100 + (Math.abs(c)%60))).slice(-4);
                    break;
                default: t += c;
            }
        }
        return t;
    },

    /**
     * Parses a formatted date string, using an optional formatting string
     * and an optional language set.
     * @param {String} str      The formatted date string
     * @param {String} [format] The format used. See DateTools.format for details
     * @param {String} [locale] The language identifier
     * @returns {Number}        Amounts of milliseconds as Unix Epoch Time of the
     *                          parsed date.
     *
     * If no formatting string is passed, it tries to parse the string as
     * the sequence "YmdHisk", and lastly resolves to using Date.parse.
     */
    parse: (function(dp) {
        return function(str, format, locale) {
            if (typeof format === "string") {
                var langObj = locale && this.i18n[locale] || _locale,
                    fld = new Array(9), fn = 1, i = 0, l = format.length, t = "", c, j;
                for (; i < l; i++) {
                    if ((c = format.charAt(i)) === "\\") {
                        t += format.charAt(++i);
                        continue;
                    }
                    if (c === "\"" && (j = format.indexOf("\"", i + 1)) !== -1) {
                        t += format.substring(i + 1, i = j);
                        continue;
                    }
                    if (c === "'" && (j = format.indexOf("'", i + 1)) !== -1) {
                        t += format.substring(i + 1, i = j);
                        continue;
                    }
                    switch (c) {
                        case "Y": t += "(\\d{4})"; fld[0] = fn++; break;
                        case "y": t += "(?:\\d\\d)"; break;
                        case "L": t += "[01]"; break;
                        case "F": t += "(" + langObj.months.join("|") + ")"; fld[1] = fn++; break;
                        case "M": t += "(" + langObj.monthsShort.join("|") + ")"; fld[1] = fn++; break;
                        case "m": case "n": t += "(\\d?\\d)"; fld[1] = fn++; break;
                        case "t": t += "(?:[012]?\\d|3[01])"; break;
                        case "D": t += "(?:" + langObj.daysShort.join("|") + ")"; break;
                        case "l": t += "(?:" + langObj.days.join("|") + ")"; break;
                        case "x": t += "(?:" + langObj.daysShort.get(0).join("|") + ")"; break;
                        case "N": t += "[1-7]"; break;
                        case "w": t += "[0-6]"; break;
                        case "z": t += "(?:[012]?\\d?\\d|3[0-5]\\d|36[0-5])"; break;
                        case "d": case "j": t += "(\\d?\\d)"; fld[2] = fn++; break;
                        case "G": case "g": t += "(0?[1-9]|1[012])"; fld[3] = fn++; break;
                        case "H": case "h": t += "([01]?\\d|2[0-3])"; fld[3] = fn++; break;
                        case "i": t += "([0-5]\\d)"; fld[4] = fn++; break;
                        case "s": t += "([0-5]\\d)"; fld[5] = fn++; break;
                        case "k": t += "(\\d{3})"; fld[6] = fn++; break;
                        case "u": t += "(\\d{3})(?:\\d{3})"; fld[6] = fn++; break;
                        case "A": case "a": t += "([apAP][mM])"; fld[7] = fn++; break;
                        case "O": t += "[\\+\\-]\\d{4}"; break;
                        case "P": t += "[\\+\\-]\\d\\d:\\d\\d"; break;
                        case "Z": t += "\\-?\\d + "; break;
                        case "U": t += "(\\d{1, 16})"; fld[8] = fn++; break;
                        case "T": t += "(?:" + Object.keys(Date.timezones).join("|") + ")"; break;
                        default: t += c;
                    }
                }
                try {var re = new RegExp(t);}
                catch (e) {return NaN;}

                var m = String(str).match(re);
                if (!m) return NaN;

                if (8 in fld) return new Date(+m[fld[8]]).getTime();
                if (1 in fld) {
                    var mon = langObj.months.indexOf(m[fld[1]]);
                    if (mon === -1) mon = langObj.monthsShort.indexOf(m[fld[1]]);
                    if (mon === -1) mon = m[fld[1]] - 1;
                    if (isNaN(mon)) mon = 0;
                } else mon = 0;
                return new Date(0 in fld ? +m[fld[0]] : 1970, mon, 2 in fld ? +m[fld[2]] : 1,
                        3 in fld ? +m[fld[3]] : 0, // Qui ci vuole in controllo su am/pm
                        4 in fld ? +m[fld[4]] : 0, 5 in fld ? +m[fld[5]] : 0, 6 in fld ? +m[fld[6]] : 0).getTime();
            }
            var m = String(str).match(/^(\d{4})(\d\d)(\d\d)(?:(\d\d)(\d\d)(?:(\d\d)(\d{3})?)?)?$/);
            if (m) return new Date(m[1], m[2] - 1, m[3], m[4] || 0, m[5] || 0, m[6] || 0, typeof m[7] === "string" ? (m[7] + "000").substring(0, 3) : 0).getTime();
            else return dp(str);
        };
    })(Date.parse),

    /**
     * For convenience, extends Date.prototype with some of DateTools' static methods.
     */
    extendDatePrototype: function() {
        var dpro = Date.prototype, i = 0,
            dt = DateTools
            methods = ["isLeapYear", "isEaster", "getISOYear", "getWeek", "setWeek", "setDay", "getISODay", "setISODay",
                    "getOrdinalDate", "getMonthLength", "getMonthName", "getMonthShortName", "getDayName", "getDayShortName",
                    "getDailyTime", "getDSTChange", "getDSTChangeTime", "shift", "clone", "format"];
        for (; i < methods.length;)
            (function(method) {
                dpro[method] = function() {
                    return DateTools[method].apply(DateTools, [this].concat(aslice.call(arguments)));
                };
            })(methods[i++]);
    },

    /**
     * Sets the locale object.
     * @param {String|Object} [locale]   The locale identifier, or the locale object.
     * If the argument is omitted, the method will attempt to identify the locale
     * using the current timezone.
     */
    setLocale: (function(tzo) {
        var isArray = Array.isArray || function(array) {
            return array instanceof Array;
        };

        return function(locale) {
            if (!arguments.length) {
                for (var loc in this.i18n) {
                    tzones = this.i18n[loc].timezones;
                    for (var i = 0; i < tzones.length; i++)
                        if (this.timezones[tzones[i]] === tzo) {
                            _locale = this.i18n[loc];
                            return;
                        }
                }
            } else if (typeof locale === "string") {
                if (locale in this.i18n) _locale = this.i18n[locale];
            } else if (typeof locale === "object") _locale = locale;
        }
    })(new Date().getTimezoneOffset()),

    /**
     * Returns a shallow copy of the locale object.
     * @returns {Object}
     */
    getLocale: function() {
        var props = ["months", "monthsShort", "days", "daysShort", "timezones"],
            i = 0, obj = {};
        for (; i < props.length; i++)
            obj[props[i]] = _locale[props[i]].slice();
        return obj;
    },

    DBT: "Y-m-d H:i:s.u",
    USA: "m/d/Y G:i:s A",
    EUR: "d/m/Y H:i:s",
    JPN: "Y/m/d H:i:s",
    DBD: "Y-m-d",
    USD: "m/d/Y",
    EUD: "d/m/Y",
    JPD: "Y/m/d",
    ORD: "Ymd",
    ORT: "YmdHis",
    ISO_8601: "Y-m-d\\TH:i:sP",
    RFC_2822: "D, j M Y H:i:s O",

    timezones: {
        ACDT: -630, ACST: -570, ADT: 180, AEDT: -660, AEST: -600, AKDT: 480, AKST: 540, ART: 180, AST: 240, AWDT: -540,
        AWST: -480, BIOT: -360, CAT: -120, CDT: 300, CEDT: -120, CEST: -120, CET: -60, CIT: -480, CKT: 600, CLST: 180,
        CLT: 240, CST: 360, CT: -480, CVT: 60, EAT: -180, EDT: 240, EEDT: -180, EEST: -180, EET: -120, EST: 300,
        FET: -180, GMT: 0, HADT: 540, HKT: -480, HST: 600, IOT: -180, IRDT: -480, IRST: -210, IST: -330, JST: -540,
        KST: -540, MDT: 360, MSK: -240, NZDT: -780, NZST: -720, PDT: 420, PKT: -300, PST: 480, UCT: 0, UTC: 0,
        WAST: -120, WAT: -60, WEDT: -60, WEST: -60, WET: 0, WST: -480
    },
    i18n: {
        en: {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            timezones: ["UTC", "GMT"]
        },
        it: {
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
            days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
            timezones: ["CET", "CEST"]
        }
    }
};

var _locale = DateTools.i18n.en;

return DateTools;

});
