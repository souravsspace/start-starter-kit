import { usePostHog } from "posthog-js/react";

interface TrackEventOptions {
  properties?: Record<string, any>;
  groups?: Record<string, string>;
}

interface IdentifyUserOptions {
  properties?: Record<string, any>;
}

export const usePostHogTracking = () => {
  const posthog = usePostHog();

  const trackEvent = (eventName: string, options?: TrackEventOptions) => {
    posthog.capture(eventName, options?.properties);

    if (options?.groups) {
      Object.entries(options.groups).forEach(([groupType, groupKey]) => {
        posthog.group(groupType, groupKey, options?.properties);
      });
    }
  };

  const identifyUser = (userId: string, options?: IdentifyUserOptions) => {
    posthog.identify(userId, options?.properties);
  };

  const resetUser = () => {
    posthog.reset();
  };

  const trackPageView = (properties?: Record<string, any>) => {
    posthog.capture("$pageview", properties);
  };

  const trackButtonClick = (
    buttonName: string,
    properties?: Record<string, any>,
  ) => {
    trackEvent("button_clicked", {
      properties: {
        button_name: buttonName,
        ...properties,
      },
    });
  };

  const trackFormSubmit = (
    formName: string,
    properties?: Record<string, any>,
  ) => {
    trackEvent("form_submitted", {
      properties: {
        form_name: formName,
        ...properties,
      },
    });
  };

  const trackNavigation = (from: string, to: string) => {
    trackEvent("page_navigated", {
      properties: {
        from,
        to,
      },
    });
  };

  const trackError = (
    errorName: string,
    errorDetails?: Record<string, any>,
  ) => {
    trackEvent("error_occurred", {
      properties: {
        error_name: errorName,
        ...errorDetails,
      },
    });
  };

  const trackFeatureUsage = (
    featureName: string,
    properties?: Record<string, any>,
  ) => {
    trackEvent("feature_used", {
      properties: {
        feature_name: featureName,
        ...properties,
      },
    });
  };

  const trackConversion = (
    conversionType: string,
    value?: number,
    properties?: Record<string, any>,
  ) => {
    trackEvent("conversion", {
      properties: {
        conversion_type: conversionType,
        value,
        ...properties,
      },
    });
  };

  return {
    trackEvent,
    identifyUser,
    resetUser,
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackNavigation,
    trackError,
    trackFeatureUsage,
    trackConversion,
  };
};

