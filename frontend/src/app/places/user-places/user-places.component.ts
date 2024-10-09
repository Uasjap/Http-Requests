import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{

  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService)
  private destroyRed = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;


  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
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
  onRemovePlace(place: Place) {
    const subscription = this.placesService.removeUserPlace(place).subscribe();
    this.destroyRed.onDestroy(() => {
      subscription.unsubscribe();
    })

  }
}
