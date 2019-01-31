class Commander {
  constructor(baseUrl, verbose = false) {
    this.verbose = verbose;
    this.baseUrl = baseUrl;
    this.handlers = {};
  }

  async bind(SyncClientClass) {
    const response = await fetch(this.baseUrl + "/sync-token");
    const json = await response.json();
    const sync = new SyncClientClass(json.token);
    const list = await sync.list("commands");
    const page = await list.getItems();
    page.items.forEach(listItem => this.dispatch(listItem.data.value));
    list.on("itemAdded", evt => this.dispatch(evt.item.data.value));
  }
  async reset() {
    if (this.verbose) {
      console.log('Resetting the command queue...');
    }
    await fetch(this.baseUrl + '/reset-command-queue');
  }

  on(commandName, callback) {
    if (this.verbose) {
      console.log('Registering handler for', commandName, 'as', callback);
    }
    const existingHandlers = this.handlers[commandName] || [];
    existingHandlers.push(callback);
    this.handlers[commandName] = existingHandlers;
  }

  dispatch(item) {
    if (this.verbose) {
      console.log('Dispatching item', item);
    }
    let handlers = this.handlers[item.commandName] || [];
    if (this.handlers["*"]) {
      handlers = handlers.concat(this.handlers["*"]);
    }
    handlers.forEach(handler => handler.apply(item, [item.params]));
  }
}
