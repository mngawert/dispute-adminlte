# Review Tabs Configuration

This document explains how to configure the tabs displayed in the Review page without requiring a redeployment.

## Configuration File

The tabs configuration is stored in the following file:
```
public/config/review-tabs-config.json
```

## Configuration Structure

The configuration file has the following structure:

```json
{
  "tabConfig": {
    "Adjust-": true,
    "Adjust+": true,
    "P31": true,
    "P32": true,
    "P35": true,
    "P36": true,
    "P3-": true,
    "P3+": true,
    "B1+/-": true
  },
  "financeRestrictedTabs": ["Adjust-", "Adjust+", "B1+/-"]
}
```

### tabConfig

This object controls which tabs are visible in the Review page. Set a value to `true` to show the tab, or `false` to hide it.

For example, to hide the P31 and P32 tabs:
```json
"tabConfig": {
  "Adjust-": true,
  "Adjust+": true,
  "P31": false,
  "P32": false,
  "P35": true,
  "P36": true,
  "P3-": true,
  "P3+": true,
  "B1+/-": true
}
```

### financeRestrictedTabs

This array specifies which tabs should be hidden specifically for Finance review, regardless of their setting in tabConfig.

## How to Update Configuration

1. Edit the `review-tabs-config.json` file
2. Save the changes
3. Refresh the browser

No redeployment is needed. The application will load the updated configuration when the page is refreshed.

## Fallback Configuration

If the configuration file cannot be loaded or contains errors, the application will use a default configuration that shows all tabs.
