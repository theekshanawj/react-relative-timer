# react-relative-timer

A Counter module for React applications. This can be used a step up or step down counter. 
This is inspired by the Github's `relative-time` and tries to allow maximum flexibility to the user.


### Basic usage 

Say you have a Web application that shows user posted stories (like twitter) and want to show when the user posted the story; Ex:
posted a few seconds ago, posted 2 minutes ago, posted hours ago, posted days ago, ...  

#### Install the dependency from npm

```javascript
npm i react-relative-timer
```

```javascript
import ReactRelativeTimer from 'react-relative-timer';

...
  render() { 
      <ReactRelativeTimer
          className="Timer"
          referenceTime={postedTimeInMills}
          formatMessage={({ seconds, minutes, hours, days }) => {
            if (minutes === 0 && hours === 0 && days === 0) {
              return 'posted a few seconds ago';
            }
            if (hours === 0 && days === 0) {
              return `posted ${minutes} minutes ago `;
            }
            if (days === 0) {
              return 'posted hours ago';
            }
            return 'posted days ago';
          }}
          updateInterval={30000}
     />
   }
```
String returned by the `formatMessage` will be the output of this component. The time difference between the `referenceTime` and current time is the parameter (Time Object) passed to the `formatMessage` function.

### API Specification


|Prop|Usage| Type |Default Value|Example|
|---|---|---|---|---|
|referenceTime| Timer uses this time as the base to calculate the time difference| Number (in milliseconds)| `Date.now()` | 1602781020000|
|updateInterval| Interval the output should be updated| Number (in milliseconds) | 10000 | 600000|
|formatMessage| Format the output of the component. Should return a string with the expected display text| Function (param: Time Object) | `({ totalSeconds, referenceTime }) => '${totalSeconds} passed from ${new Date(referenceTime)}'`| `({ minutes }) => '${minutes}min ago`
|now| Difference between `now` and `referenceTime` is used in the counter. Override this if you want `current` time to be something other than current epoch time | Function | `() => Date.now()` | `() => Date.now() + c`| 
|clearTimer|If you want to stop the output being updated, override this function| Function (param: Time Object) | `() => false` | `({ hours}) => hours < 5`|
|isStepUp| Decide on the step up or step down counter functionality| Boolean | `true` | `false`|
| className | Use this to style output `div` by passing a CSS class name | String | `''` | `timer`|
|dataId| Access the output JS element selectors  | 'String' | `react-relative-timer` | `my-timer` |

#### Timer Object

For `formatMessage` and `clearTimer` functions a Timer Object is passed with following keys
```javascript
{
    totalMills,   // Diff between now() - referenceTime if step up or referenceTime - now() if step down
    totalSeconds, // Diff in Seconds
    mills,        // How many milliseconds in the time diff
    seconds,      // How many seconds in the time diff
    minutes,      // How many minutes in the time diff
    hours,        // How many hours in the time diff
    days,         // How many days in the time diff
    referenceTime // referenceTime
 }
```

