L.drawLocal.draw.toolbar.buttons.polyline = 'Draw no-go area (polyline)';
L.drawLocal.edit.toolbar.buttons.edit = 'Edit no-go areas';
L.drawLocal.edit.toolbar.buttons.remove = 'Delete no-go areas';
    
BR.NogoAreas = L.Control.Draw.extend({
    initialize: function () {
        this.drawnItems = new L.FeatureGroup();

        L.Control.Draw.prototype.initialize.call(this, {
            draw: {
                position: 'topleft',
                polyline: true,
                polygon: false, 
                circle: false, 
                rectangle: false, 
                marker: false 
            },
            edit: {
                featureGroup: this.drawnItems,
                //edit: false,
                edit: {
                    selectedPathOptions: {
                        //opacity: 0.8
                    }
                },
                remove: true
            }
        });
    },

    onAdd: function (map) {
        map.addLayer(this.drawnItems);

        map.on('draw:created', function (e) {
            var layer = e.layer;
            this.drawnItems.addLayer(layer);
            this._fireUpdate();
        }, this);

        map.on('draw:editstart', function (e) {
            this.drawnItems.eachLayer(function (layer) {
                layer.on('edit', function(e) {
                    this._fireUpdate();
                }, this);
            }, this);
        }, this);

        map.on('draw:deleted', function (e) {
            this._fireUpdate();
        }, this);

        return L.Control.Draw.prototype.onAdd.call(this, map);
    },

    getOptions: function() {
        return {
            nogos: this.drawnItems.getLayers()
        };
    },

    setOptions: function(options) {
        var nogos = options.nogos;
        if (nogos) {
            this.drawnItems.clearLayers();
            for (var i = 0; i < nogos.length; i++) {
                this.drawnItems.addLayer(nogos[i]);
            }
        }
    },

    _fireUpdate: function () {
        this.fire('update', {options: this.getOptions()});
    }
});

BR.NogoAreas.include(L.Mixin.Events);