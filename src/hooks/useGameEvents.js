import { useEffect, useCallback } from 'react';

/**
 * useGameEvents Hook
 * Allows React components to listen to and emit events from/to Phaser
 * Uses a global event emitter attached to window
 */
export const useGameEvents = () => {
  // Get or create global event emitter
  const getEventEmitter = useCallback(() => {
    if (!window.gameEvents) {
      const eventMap = {};

      window.gameEvents = {
        on: (eventName, callback) => {
          if (!eventMap[eventName]) {
            eventMap[eventName] = [];
          }
          eventMap[eventName].push(callback);

          // Return unsubscribe function
          return () => {
            eventMap[eventName] = eventMap[eventName].filter(cb => cb !== callback);
          };
        },

        off: (eventName, callback) => {
          if (eventMap[eventName]) {
            eventMap[eventName] = eventMap[eventName].filter(cb => cb !== callback);
          }
        },

        emit: (eventName, data) => {
          if (eventMap[eventName]) {
            eventMap[eventName].forEach(cb => cb(data));
          }
        },

        once: (eventName, callback) => {
          const wrapper = (data) => {
            callback(data);
            window.gameEvents.off(eventName, wrapper);
          };
          window.gameEvents.on(eventName, wrapper);
        },

        clear: () => {
          Object.keys(eventMap).forEach(key => delete eventMap[key]);
        }
      };
    }

    return window.gameEvents;
  }, []);

  return getEventEmitter();
};

/**
 * useGameEventListener Hook
 * Subscribe to game events in React components
 */
export const useGameEventListener = (eventName, callback, dependencies = []) => {
  const gameEvents = useGameEvents();

  useEffect(() => {
    const unsubscribe = gameEvents.on(eventName, callback);
    return unsubscribe;
  }, [eventName, callback, gameEvents, ...dependencies]);
};

/**
 * useGameEventEmitter Hook
 * Emit events to Phaser from React components
 */
export const useGameEventEmitter = () => {
  const gameEvents = useGameEvents();

  const emit = useCallback((eventName, data) => {
    gameEvents.emit(eventName, data);
  }, [gameEvents]);

  return { emit };
};
