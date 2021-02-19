import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListaVideos } from '../shared/lista-videos';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css']
})
export class TutorialListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  public listVideos = [];
  private idVideo = '';

  ngOnInit() {

    this.listVideos = ListaVideos.listVideos;

    this.idVideo = this.route.snapshot.params['id'];
    if (this.idVideo) {
      this.listVideos = [];
      this.listVideos.push(ListaVideos.getVideoId(this.idVideo));
    }

  }

}
