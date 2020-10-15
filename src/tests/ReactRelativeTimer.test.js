import React from 'react';
import { render } from '@testing-library/react';
import ReactRelativeTimer from '../ReactRelativeTimer';

describe('ReactRelativeTimer', () => {
    const getInstanceOfReactRelativeTimer = (
        referenceTime,
        updateInterval,
        clearTimer,
        ref = React.createRef(),
        isStepUp = true,
    ) => (
        <ReactRelativeTimer
            formatMessage={({ hours, minutes, seconds }) => `${hours}h ${minutes}min ${seconds}sec ago`}
            referenceTime={referenceTime}
            updateInterval={updateInterval}
            clearTimer={clearTimer}
            ref={ref}
            isStepUp={isStepUp}
        />
    );

    beforeEach(() => {
        //  Thursday, October 15, 2020 5:30:20 AM
        Date.now = jest.fn().mockReturnValue(1602739820000);
        window.setInterval = jest.fn().mockReturnValue(Math.random());
    });

    test('it should render the component', () => {
        window.setInterval.mockClear();
        const { getByText } = render(<ReactRelativeTimer />);
        // Expect the default formatMessage messages output
        expect(getByText(/passed from/)).toBeInTheDocument();
        // Expect set interval has been called to register the timer
        expect(window.setInterval).toHaveBeenCalled();
    });
    test('it should show the message according to formatMessage function', () => {
        const { getByText } = render(getInstanceOfReactRelativeTimer(1602720000000, 1000, () => false));
        expect(getByText('5h 30min 20sec ago')).toBeInTheDocument();
    });
    test('it should not register if updateInterval negative and clearTimer return false', () => {
        window.setInterval.mockClear();
        render(getInstanceOfReactRelativeTimer(1602720000000, -100, () => false));
        expect(window.setInterval).not.toHaveBeenCalled();

        render(getInstanceOfReactRelativeTimer(1602720000000, 10000, () => true));
        expect(window.setInterval).not.toHaveBeenCalled();
    });
    test('it should update the text when setInterval is being called', () => {
        window.clearInterval = jest.fn();
        const ref = React.createRef();
        const component = getInstanceOfReactRelativeTimer(1602720000000, 1000, ({ hours }) => hours > 10, ref);
        const { getByText, rerender } = render(component);
        expect(getByText('5h 30min 20sec ago')).toBeInTheDocument();

        // Thursday, October 15, 2020 4:59:00 PM
        Date.now = jest.fn().mockReturnValue(1602781140000);
        ref.current.setIntervalHandler();

        rerender(component);
        // Updated component should be there
        expect(getByText('16h 59min 0sec ago')).toBeInTheDocument();
        // As we have defined the clear timer to clear the timer when hours > 10, timer should be cleared
        expect(window.clearInterval).toHaveBeenCalled();
    });
    test('it should be able to act as a step down counter', () => {
        Date.now = jest.fn().mockReturnValue(1602720000000);
        const { getByText } = render(
            getInstanceOfReactRelativeTimer(1602739820000, 1000, () => false, React.createRef(), false),
        );
        expect(getByText('5h 30min 20sec ago')).toBeInTheDocument();
    });
});

