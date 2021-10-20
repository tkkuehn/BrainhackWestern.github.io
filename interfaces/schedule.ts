import { BasicDate } from "./generic";


/**
 * @additionalProperties false
 */
interface ScheduleDay extends BasicDate {
    /**
     * @additionalProperties false
     */
    events: {
        name: string;

        /**
         * Time of the event (in 24hr time)
         * @pattern ^\d\d?\:\d\d$
         */
        time: string;

        /**
         * Length of the event
         * @pattern ^\d\d?\:\d\d$
         */
        duration: string;
    }[];
}

/**
 * @additionalProperties false
 */
export interface ScheduleConfig {
    show: boolean;

    /**
     * First hour to display on the schedule (in 24hr time).
     * @minimum 0
     * @maximum 23
     */
    startTime: number;

    /**
     * Last hour to display on the schedule (in 24hr time).
     * Events falling after this will be clipped.
     * @minimum 0
     * @maximum 23
     */
    endTime: number;
    days: ScheduleDay[];
}