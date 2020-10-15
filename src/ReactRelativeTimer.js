import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Time constants
const MILLS_IN_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const SECONDS_IN_A_HOUR = 60 * 60;
const SECONDS_IN_A_DAY = 60 * 60 * 24;

class ReactRelativeTimer extends PureComponent {
    constructor(props) {
        super(props);
        const { formatMessage } = props;
        this.state = {
            formattedMessage: formatMessage(this.calculateDiffInTime(props)),
        };
        // save the id returned bby setInterval
        this.timer = null;
    }

    componentDidMount() {
        const { updateInterval, clearTimer } = this.props;
        const timeDiff = this.calculateDiffInTime(this.props);
        // If positive interval and clearTimer returns false register a timer
        if (updateInterval > 0 && !clearTimer(timeDiff)) {
            //
            this.timer = setInterval(() => {
                this.setIntervalHandler();
            }, updateInterval);
        }
    }

    componentWillUnmount() {
        this.clearTimerInterval();
    }

    setIntervalHandler = () => {
        const { formatMessage, clearTimer } = this.props;
        const timeDiff = this.calculateDiffInTime(this.props);
        // If clearTimer returns true, remove the timer
        if (clearTimer(timeDiff)) {
            this.clearTimerInterval();
        }
        // Update the formattedMessage per updateInterval
        this.setState({
            formattedMessage: formatMessage(timeDiff),
        });
    };

    calculateDiffInTime = ({ referenceTime, now, isStepUp }) => {
        const totalMills = isStepUp ? now() - referenceTime : referenceTime - now();
        // Get the diff in seconds
        const totalSeconds = Math.floor(totalMills / MILLS_IN_SECOND);

        // Calculate Hours, Minutes and Second in the diff
        const days = Math.floor(totalSeconds / SECONDS_IN_A_DAY);
        const remainingHours = totalSeconds - days * SECONDS_IN_A_DAY;
        const hours = Math.floor(remainingHours / SECONDS_IN_A_HOUR);
        const remainingMinutes = remainingHours - hours * SECONDS_IN_A_HOUR;
        const minutes = Math.floor(remainingMinutes / SECONDS_IN_A_MINUTE);
        const seconds = Math.floor(totalSeconds % SECONDS_IN_A_MINUTE);
        const mills = Math.floor(totalMills % MILLS_IN_SECOND);

        return {
            totalMills,
            totalSeconds,
            mills,
            seconds,
            minutes,
            hours,
            days,
            referenceTime,
        };
    };

    clearTimerInterval() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        const { className, dataId } = this.props;
        const { formattedMessage } = this.state;
        return (
            <div className={className} data-id={dataId}>
                {formattedMessage}
            </div>
        );
    }
}

ReactRelativeTimer.defaultProps = {
    referenceTime: Date.now(),
    updateInterval: 10000,
    formatMessage: ({ totalSeconds, referenceTime }) => `${totalSeconds} passed from ${new Date(referenceTime)}`,
    clearTimer: () => false,
    now: () => Date.now(),
    className: '',
    dataId: 'react-relative-timer',
    isStepUp: true,
};

ReactRelativeTimer.propTypes = {
    referenceTime: PropTypes.number,
    updateInterval: PropTypes.number,
    formatMessage: PropTypes.func,
    className: PropTypes.string,
    dataId: PropTypes.string,
    clearTimer: PropTypes.func,
    now: PropTypes.func,
    isStepUp: PropTypes.bool,
};

export default ReactRelativeTimer;
