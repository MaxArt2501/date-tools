date-tools
==========

A node.js package, AMD module and global object for date manipulation and formatting.

## Installation

As a node.js package:

```bash
$ npm install dateformat
```

As a standalone Javascript file (not needed when using AMD loaders like Require.js):

```html
<script type="text/javascript" src="date-tools.js"></script>
```

## Usage

When using an AMD loader (like RequireJS in this example), you should require the module
like this:

```js
require(["date-tools"], function(DateTools) {
    ...
});
```

If you're not using an AMD loader, you're ready to go with the `DateTools` object as long as
the script is loaded before the one using it.

In a node.js application, just do

```js
var DateTools = require("date-tools");
```

Most of the juice of `DateTools` is condensed in its static methods. Most of these methods take a
`Date` object as their first argument. So, additionally, the method `extendDatePrototype` ports
most of the functions in `Date.prototype` for your convenience, so you can do this:

```js
var date = new Date(),
    day = DateTools.getISODay(date);

DateTools.extendDatePrototype();
var day2 = date.getISODay();

day === day2;   // true
```

## APIs

### `isLeapYear`

Checks if a year is leap.

*Parameters*

`year` (`Number` | `Date`) If a `Date` object is given, `year.getFullYear()` is used

*Returns*

`Boolean`
 

### `isSameDay`

Checks if two dates represent the same day.

*Parameters*

`date1` (`Date`)

`date2` (`Date`)

*Returns*

`Boolean`
 

### `getEaster`

Returns a Date object representing the Easter for the given year, according to the Western
Gregorian calendar.

*Parameters*

`year` (`Number` | `Date`)

*Returns*

`Date`
 

### `isEaster`

Checks if a `Date` object is an Easter date, according to the Western Gregorian calendar.

*Parameters*

`date` (`Date`)

*Returns*

`Boolean`
 

### `getOrdinalDate`

Returns the ordinal date of a `Date` object (i.e., the number of days since January 1st of the same
year, plus one).

*Parameters*

`date` (`Date`)

*Returns*

`Number`   Ranging 1-366
 

### `getISOYear`

Returns the year as per ISO 8601 standard.

*Parameters*

`date` (`Date`)

*Returns*

`Number`
 

### `getWeek`

Returns the number of the week for a given date, as per ISO 8601 standard.

*Parameters*

`date` (`Date`)

*Returns*

`Number`
 
### `setWeek`

Sets the number of the week, keeping the day of the week, for a given date, as per ISO 8601
standard. The original date is modified.

*Parameters*

`date` (`Date`)

`week` (`Number`) Ranging 1-52/53 for a year

*Returns*

`Number`     Timestamp of the modified date
 
### `getISODay`

Returns the day of the week for a given date, as per ISO 8601 standard.

*Parameters*

`date` (`Date`)

*Returns*

`Number`    Ranging 1 (Monday) - 7 (Sunday)
 

### `setISODay`

Sets the day of the week for a given date, as per ISO 8601 standard.
The original date is modified.

*Parameters*

`date` (`Date`)

`day` (`Number`)  Ranging 1-7

*Returns*

`Number`     Timestamp of the modified date
 

### `getMonthLength`

Returns the amount of days in the month of a given date.

*Parameters*

`date` (`Date`)

*Returns*

`Number`
 

### `getMonthName`

Returns the name of the month for a given date.

*Parameters*

`date` (`Date`)

`[lang]` (`String`)  Language identifier (defaults to `DateTools.language`)

*Returns*

`String`
 

### `getMonthShortName`

Returns the shortened name of the month for a given date.

*Parameters*

`date` (`Date`)

`[lang]` (`String`)  Language identifier (defaults to `DateTools.language`)

*Returns*

`String`
 

### `getDayName`

Returns the name of the day of the week for a given date.

*Parameters*

`date` (`Date`)

`[lang]` (`String`)  Language identifier (defaults to DateTools.language)

*Returns*

`String`
 

### `getDayShortName`

Returns the shortened name of the day of the week for a given date.

*Parameters*

`date` (`Date`)

`[lang]` (`String`)  Language identifier (defaults to DateTools.language)

*Returns*

`String`
 

### `getDailyTime`

Returns the amount of milliseconds since midnight of a given date.

*Parameters*

`date` (`Date`)

*Returns*

`Number`
 

### `getDSTChangeTime`

Returns the istant the Daylight Saving Time change happens in a given date.
If no change happens for the date, it returns the timestamp of the midnight.

*Parameters*

`date` (`Date`)

*Returns*

`Number`
 

### `shift`

Shift a given date by a certain amount of milliseconds, or
years/months/days/hours/minutes/seconds/milliseconds (if more than
one argument is given). The original date is modified.

*Parameters*

`years` (`Number`)     Adds that amount of years to the given date.
But if it's the only argument, it's considered the amount of milliseconds
to add to `getTime` instead.

*Parameters*

`[months]` (`Number`)

`[days]` (`Number`)

`[hours]` (`Number`)

`[minutes]` (`Number`)

`[seconds]` (`Number`)

`[millis]` (`Number`)

*Returns*

`Number`         The shifted `date.getTime()`
 

### `clone`

Clones a date object, plus it takes extra arguments to shift it
just like .shift

*Parameters*

`years` (`Number`)     Adds that amount of years to the cloned date.
                       But if it's the only argument, it's considered the
                       amount of milliseconds to add to getTime instead.

*Parameters*

`[months]` (`Number`)

`[days]` (`Number`)

`[hours]` (`Number`)

`[minutes]` (`Number`)

`[seconds]` (`Number`)

`[millis]` (`Number`)

*Returns*

`Date`           The cloned date
 

### `format`

Formats a date object, using a given formatting string and an optional
language set.

*Parameters*

`date` (`Date`)

`format` (`String`)   The formatting string

`[lang]` (`String`)   The language identifier

*Returns*

`String`              The formatted date

The formatting string can be built in the same manner of PHP's `date`
function, plus some other codes. Each letter can be escaped with a
backslash, so it won't interpreted as a formatting code. Moreover,
literal strings can be included when enclosed in single or double
quotation marks.
 

### `parse`

Parses a formatted date string, using an optional formatting string
and an optional language set.

*Parameters*

`str` (`String`)      The formatted date string

`[format]` (`String`) The format used. See `format` for details

`[lang]` (`String`)   The language identifier

*Returns*

`Number`        Amounts of milliseconds as Unix Epoch Time of the
                         parsed date.

If no formatting string is passed, it tries to parse the string as
the sequence `"YmdHisk"`, and lastly resolves to using `Date.parse`.

### `setLocale`

Sets the locale object.

*Parameters*

`[locale]` (`String` | `Object`)    The locale identifier, or the locale object.

If the argument is omitted, the method will attempt to identify the locale using the
current timezone.

### `getLocale`

Returns a shallow copy of the locale object.

*Returns*

`Object`


### `extendDatePrototype`

For convenience, extends `Date.prototype` with some of `DateTools`' static methods. All `DateTools` methods,
except `getEaster`, 


## Date formatting

`DateUtils.format` provide a simple way to format `Date` object, quite similar to PHP's `date`
function. To format a date, a formatting string must be passed, with each letter of the string
representing different values of the `Date` object according to the following table:

| Character | Description | Values |
|:---------:|-------------|--------|
| `j` | Day of the month | `1` to `31` |
| `d` | Day of the month with leading zeros | `01` to `31` |
| `l` | Full textual representation of the day of the week | `Sunday` to `Saturday` |
| `D` | Short textual representation of the day of the week | `Mon` to `Sun` |
| `x` | One letter representation of the day of the week | `M` to `S` |
| `w` | Numeric representation of the day of the week | `0` to `6` |
| `N` | ISO 8601 numeric representation of the day of the week | `1` to `7` |
| `z` | The day of the year | `0` to `365` |
| `W` | ISO 8601 week number of year | `0` to `52` |
| `F` | Full textual representation of the month | `January` to `December` |
| `M` | Short textual representation of the month | `Jan` to `Dec` |
| `n` | Numeric representation of the month | `1` to `12` |
| `m` | Numeric representation of the month with leading zeros | `01` to `12` |
| `t` | Number of days in the given month | `28` to `31` |
| `L` | Whether it's a leap year | `1` leap year, `0` otherwise |
| `o` | ISO 8601 year number. This has the same value as `Y`, except that if the ISO week number (`W`) belongs to the previous or next year, that year is used instead. |  |
| `Y` | Full numeric representation of the year, 4 digits |  |
| `y` | Two digit representation of the year | `00` to `99` |
| `a` | Lowercase Ante meridiem and Post meridiem | `am` or `pm` |
| `A` | Uppercase Ante meridiem and Post meridiem | `AM` or `PM` |
| `g` | 12-hour format | `1` to `12` |
| `G` | 24-hour format | `0` to `23` |
| `h` | 12-hour format with leading zeros | `01` to `12` |
| `H` | 24-hour format with leading zeros | `00` to `23` |
| `i` | Minutes with leading zeros | `00` to `59` |
| `s` | Seconds with leading zeros | `00` to `59` |
| `k` | Milliseconds | `000` to `999` |
| `u` | Microseconds. It's actually just `k` followed by `000` | `000000` to `999999` |
| `O` | Difference to Greenwich time (GMT) in hours | `+0200` |
| `P` | Difference to Greenwich time (GMT) with colon between hours and minutes | `+02:00` |
| `T` | Timezone abbreviation | EST, MDT ... |
| `Z` | Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive. | `-43200` to `50400` |
| `c` | ISO 8601 formatted date |  |
| `r` | RFC 2822 formatted date |  |
| `U` | Seconds since the Unix Epoch |  |

## Internationalization

Developers can add locale settings to be used in methods like `format`, `parse`,
`getMonthName` and so on. User defined locales can be added to the `DateTools.i18n`
object:

```js
DateTools.i18n["fr-FR"] = {
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi",
        "Jeudi", "Vendredi", "Samedi"],
    daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    timezones: ["CET", "CEST"]
};

DateTools.format(new Date(2014, 1, 14), "l, j F Y", "fr-FR");  // Vendredi, 14 Février 2014
```

Locales are objects with the following properties:

* `months`: array of 12 elements with the names of the months;
* `monthsShort`: array of 12 elements with the *shortened* names of the months;
* `days`: array of 7 elements with the names of the days of the week;
* `daysShort`: array of 7 elements with the *shortened* names of the days of the week;
* `timezones`: array of the names of timezones pertaining to the locale area.

If these conditions aren't met, you may get unpredictable results with methods that use locale
settings.

Alternatively, the static method `setLocale` can be used to define the default locale settings:

```js
DateTools.setLocale("fr-FR");
DateTools.getDayName(DateTools.getEaster(2014));   // Dimanche
```

`DateTools.setLocale` can also be called with a locale settings object as its parameter, which
will be used as the default locale settings:

```js
// Sets Italian locale settings
DateUtils.setLocale({
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
        "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    days: ["Domenica", "Lunedì", "Martedì", "Mercoledì",
        "Giovedì", "Venerdì", "Sabato"],
    daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
    timezones: ["CET", "CEST"]
});
```

Keep in mind that, of course, locales set like this won't be set in `DateTools.i18n` and so they
could't be used in other way than the default locale settings.


## Compatibility

In theory, everything that supports Javascript with EcmaScript 3, and `Date` objects.
In practice, this is compatible with:

* Internet Explorer 5+
* Firefox, Chrome, Safari, Opera (every version, even mobile)
* RequireJS and any AMD loader
* WebWorkers
* node.js

## License

The MIT License (MIT)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
