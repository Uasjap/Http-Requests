import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
private placesService = inject(PlacesService)
  private destroyRed = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = 
    this.placesService.loadAvailablePlaces().subscribe({
        next: (places) => {
          this.places.set(places);
        },
        error: (error) => {
          this.error.set(error);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });
    this.destroyRed.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
    .subscribe({
      next: (resData) => console.log(resData)
    })
    this.destroyRed.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
