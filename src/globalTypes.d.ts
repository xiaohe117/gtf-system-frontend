import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
/* eslint-disable no-unused-vars */
declare global {
	interface Window {
		guiziMap: {
			map: Map;
			mapView: MapView;
		};
	}
}
