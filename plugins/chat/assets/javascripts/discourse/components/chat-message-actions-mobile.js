import Component from "@ember/component";
import discourseLater from "discourse-common/lib/later";
import { action } from "@ember/object";
import { isTesting } from "discourse-common/config/environment";

export default Component.extend({
  tagName: "",
  hasExpandedReply: false,
  messageActions: null,

  didInsertElement() {
    this._super(...arguments);

    discourseLater(this._addFadeIn);

    if (this.capabilities.canVibrate && !isTesting()) {
      navigator.vibrate(5);
    }
  },

  @action
  expandReply(event) {
    event.stopPropagation();
    this.set("hasExpandedReply", true);
  },

  @action
  collapseMenu(event) {
    event.stopPropagation();
    this.onCloseMenu();
  },

  @action
  actAndCloseMenu(fn) {
    fn?.();
    this.onCloseMenu();
  },

  onCloseMenu() {
    this._removeFadeIn();

    // we don't want to remove the component right away as it's animating
    // 200 is equal to the duration of the css animation
    discourseLater(() => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      // by ensuring we are not hovering any message anymore
      // we also ensure the menu is fully removed
      this.onHoverMessage?.(null);
    }, 200);
  },

  _addFadeIn() {
    document
      .querySelector(".chat-msgactions-backdrop")
      ?.classList.add("fade-in");
  },

  _removeFadeIn() {
    document
      .querySelector(".chat-msgactions-backdrop")
      ?.classList?.remove("fade-in");
  },
});
