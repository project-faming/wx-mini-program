Component({
  properties: {
    isAgent: {
      type: Boolean,
      value: true,
    },
    brokeragePrice: {
      type: Number,
      value: 0,
    }
  },
  data: {

  },
  attached: function () {

  },
  methods: {
    close: function () {
      this.triggerEvent('onColse');
    },
    sharedFn:function(){
      this.triggerEvent('sharedFn');
    }
  }
})