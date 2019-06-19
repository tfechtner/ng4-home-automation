import { catchError, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SonosActions } from './sonos.actions';
import { NestService } from '../../../services/nest/nest.service';
import { SonosZones } from '../../../services/nest/dto/sonosZones.dto';
import { SonosCoordinatorState } from '../../../services/nest/dto/sonosCoordinatorState.dto';

export const sonosRoomStateDefaults: SonosCoordinatorState = {
    volume: null,
    mute: null,
    equalizer: {
        bass: null,
        treble: null,
        loudness: null,
    },
    currentTrack: {
        artist: null,
        title: null,
        albumArtUri: null,
        duration: null,
        uri: null,
        trackUri: null,
        type: null,
        stationName: null,
        absoluteAlbumArtUri: null,
    },
    nextTrack: {
        artist: null,
        title: null,
        album: null,
        albumArtUri: null,
        duration: null,
        uri: null,
    },
    trackNo: null,
    elapsedTime: null,
    elapsedTimeFormatted: null,
    playbackState: null,
    playMode: {
        repeat: null,
        shuffle: null,
        crossfade: null,
    }
};

export interface ISonosStateModel {
    isConnected: boolean;
    lounge: SonosCoordinatorState;
    bedroom: SonosCoordinatorState;
}

export const defaults: ISonosStateModel = {
    isConnected: null,
    lounge: sonosRoomStateDefaults,
    bedroom: sonosRoomStateDefaults,
};

@State<ISonosStateModel>({
    name: 'Sonos',
    defaults
})
export class SonosState {
    @Selector()
    public static lounge(
        state: ISonosStateModel
    ): SonosCoordinatorState {
        return state.lounge;
    }
    @Selector()
    public static bedroom(
        state: ISonosStateModel
    ): SonosCoordinatorState {
        return state.bedroom;
    }

    constructor(
        private _nestService: NestService
    ) {}

    @Action(SonosActions.GetZones)
    GetZones(
        { patchState }: StateContext<ISonosStateModel>
    ) {
        return this._nestService.getSonosZones().pipe(
            take(1),
            tap( (sonosZones: SonosZones) => {
                const loungeZone = sonosZones.find(zone => zone.coordinator.roomName === 'lounge');
                patchState({ lounge: loungeZone.coordinator.state });

                const bedroomZone = sonosZones.find(zone => zone.coordinator.roomName === 'bedroom');
                patchState({ bedroom: bedroomZone.coordinator.state });
            }),
            catchError(err => of('Caught error on SonosActions.GetZones = ' + err))
        );
    }

    @Action(SonosActions.RoomGetState)
    roomGetState(
        { getState, setState, patchState }: StateContext<ISonosStateModel>,
        { payload }: SonosActions.RoomGetState) {
        // return this._sonosService.getRoomState(payload.room).pipe(
        //     take(1),
        //     tap( roomState => {
        //         patchState({ [payload.room]: { ...roomState }});
        //     }),
        //     catchError(err => of('Caught error on SonosActions.RoomGetState = ' + err))
        // );

    }
}
