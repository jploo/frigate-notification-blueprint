# Frigate GenAI Notification Blueprint

This repository contains a simplified Home Assistant automation blueprint for
Frigate MQTT notifications. It is inspired by SgtBatten's Frigate Camera
Notifications blueprint, but intentionally narrows the scope to Frigate review
and object events, mobile app / notify-group notifications, simple filtering, configurable
attachments, and explicit GenAI behavior.

## Design Notes

- Primary trigger: `frigate/events`
- Review updates: `frigate/reviews`, used after the initial object event to
  pick up review severity, related detections, zones, and GenAI review summaries
- Optional GenAI object-description updates: `frigate/tracked_object_update`
- While an object event is active, the blueprint continues watching
  `frigate/events` for same-object zone/object metadata changes.
- Default event type: alerts only
- Default GenAI behavior: prefer object descriptions, then fall back to review
  summaries when object descriptions are not generated
- Notification updates are silent: Android uses `alert_once` with the same
  notification tag, and iOS/macOS GenAI replacement updates use
  `push.sound: none`
- Required-zone automations can start from any matching Frigate object event
  where the object is currently in one of the selected zones.
- Default action buttons match SgtBatten's common defaults:
  - View Clip
  - View Snapshot
  - Silence New Notifications

When both GenAI review summaries and object descriptions are enabled, review
summaries are preferred for multi-object activity and object descriptions are
preferred for single-object activity. If an object filter is configured, object
descriptions whose tracked-object labels match that filter are preferred.

## Inputs Worth Reviewing First

- `notify_service`: use either a single mobile app notify service or a notify
  group, for example `notify.mobile_app_pixel_8` or `notify.family`
- `camera`: optional Frigate camera entities from the Home Assistant
  Frigate integration. Leave empty to allow all cameras.
- `event_types`: defaults to `alert`
- `genai_source`: defaults to object descriptions, then review summaries
- `initial_behavior`: defaults to waiting for GenAI and falling back to the
  default template on timeout
- `genai_replacement`: choose whether GenAI replaces the message only, or both
  title and message
- `tag`: defaults to `{{ review_id }}`. With object-event triggering, this is
  initialized from the object event ID so updates replace the prior notification.

## Validation

Install dependencies once:

```powershell
npm install
```

Validate YAML before importing into Home Assistant:

```powershell
npm run validate:yaml
```

## Troubleshooting

If traces show `dict object has no attribute 'genai'` on a review update, make
sure Home Assistant has re-imported the latest blueprint. Normal Frigate review
updates can have `data.metadata: null` and no `data.genai`; the blueprint uses
safe fallbacks for those updates and continues waiting for
`frigate/tracked_object_update` GenAI descriptions.

## References

- SgtBatten Frigate Camera Notifications:
  https://github.com/SgtBatten/HA_blueprints/tree/main/Frigate_Camera_Notifications
- Frigate MQTT docs:
  https://docs.frigate.video/integrations/mqtt/
- Frigate Home Assistant notifications:
  https://docs.frigate.video/guides/ha_notifications/
- Frigate GenAI review summaries:
  https://docs.frigate.video/configuration/genai/genai_review/
- Frigate GenAI object descriptions:
  https://docs.frigate.video/configuration/genai/genai_objects/
