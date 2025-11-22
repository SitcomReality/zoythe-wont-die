/**
 * Memory Context
 * Tracks specific story details for coherence and callbacks
 */

export function createMemoryContext() {
  return {
    // Collections
    locations: [], // {id, name, firstMentioned, lastVisited, beatContext}
    items: [], // {id, name, description, context}
    npcs: [], // {id, name, role, firstMet, lastSeen}
    discoveries: [], // {what, beatId, timestamp}
    promises: [], // {what, to, beatId, fulfilled, timestamp}
    lies: [], // {what, to, beatId, timestamp}
    twistsSeeded: [], // {type, hint, beatId, timestamp}
    consequences: [], // {action, effect, beatId, fulfilled, timestamp}

    // Add a location
    addLocation(name, beatContext = {}) {
      const existing = this.locations.find(l => l.name === name);
      if (existing) {
        existing.lastVisited = Date.now();
        return existing.id;
      }
      const id = `loc-${Date.now()}`;
      this.locations.push({
        id,
        name,
        firstMentioned: Date.now(),
        lastVisited: Date.now(),
        beatContext
      });
      return id;
    },

    // Add an item mention
    addItem(name, description = "", context = {}) {
      const id = `item-${Date.now()}`;
      this.items.push({
        id,
        name,
        description,
        context,
        timestamp: Date.now()
      });
      return id;
    },

    // Add an NPC mention
    addNpc(id, name, role, beatContext = {}) {
      const existing = this.npcs.find(n => n.id === id);
      if (existing) {
        existing.lastSeen = Date.now();
        return;
      }
      this.npcs.push({
        id,
        name,
        role,
        firstMet: Date.now(),
        lastSeen: Date.now(),
        beatContext
      });
    },

    // Track a discovery
    addDiscovery(what, beatId) {
      this.discoveries.push({
        what,
        beatId,
        timestamp: Date.now()
      });
    },

    // Track a promise
    addPromise(what, to, beatId) {
      this.promises.push({
        what,
        to,
        beatId,
        fulfilled: false,
        timestamp: Date.now()
      });
    },

    // Track a lie
    addLie(what, to, beatId) {
      this.lies.push({
        what,
        to,
        beatId,
        timestamp: Date.now()
      });
    },

    // Seed a future twist
    seedTwist(type, hint, beatId) {
      this.twistsSeeded.push({
        type,
        hint,
        beatId,
        timestamp: Date.now()
      });
    },

    // Track a consequence
    addConsequence(action, effect, beatId) {
      this.consequences.push({
        action,
        effect,
        beatId,
        fulfilled: false,
        timestamp: Date.now()
      });
    },

    // Fulfill a promise
    fulfillPromise(index) {
      if (this.promises[index]) {
        this.promises[index].fulfilled = true;
      }
    },

    // Fulfill a consequence
    fulfillConsequence(index) {
      if (this.consequences[index]) {
        this.consequences[index].fulfilled = true;
      }
    },

    // Retrieve: recent events
    getRecentEvents(count = 5) {
      const all = [
        ...this.discoveries.map(d => ({...d, type: 'discovery', relevance: 3})),
        ...this.promises.map(p => ({...p, type: 'promise', relevance: p.fulfilled ? 1 : 4})),
        ...this.lies.map(l => ({...l, type: 'lie', relevance: 2}))
      ];
      return all
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, count);
    },

    // Retrieve: locations summary
    getLocationsSummary() {
      return this.locations.map(l => ({name: l.name, visits: 1}));
    },

    // Retrieve: unfulfilled promises
    getUnfulfilledPromises() {
      return this.promises.filter(p => !p.fulfilled);
    },

    // Retrieve: unfulfilled consequences
    getUnfulfilledConsequences() {
      return this.consequences.filter(c => !c.fulfilled);
    },

    // Retrieve: NPCs
    getKnownNpcs() {
      return this.npcs.map(n => ({name: n.name, role: n.role}));
    },

    // Serialize
    serialize() {
      return {
        locations: this.locations,
        items: this.items,
        npcs: this.npcs,
        discoveries: this.discoveries,
        promises: this.promises,
        lies: this.lies,
        twistsSeeded: this.twistsSeeded,
        consequences: this.consequences
      };
    },

    // Deserialize
    deserialize(data) {
      if (!data) return;
      this.locations = data.locations || [];
      this.items = data.items || [];
      this.npcs = data.npcs || [];
      this.discoveries = data.discoveries || [];
      this.promises = data.promises || [];
      this.lies = data.lies || [];
      this.twistsSeeded = data.twistsSeeded || [];
      this.consequences = data.consequences || [];
    }
  };
}