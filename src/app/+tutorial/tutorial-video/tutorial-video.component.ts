import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tutorial-video',
  templateUrl: './tutorial-video.component.html',
  styleUrls: ['./tutorial-video.component.css']
})
export class TutorialVideoComponent implements OnInit {



  @Input() title: string;
  @Input() idVimeo: string;

  private link;
  private titleVideo;

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getLink();
  }


  getLink() {

    try {
      if (this.isExits(this.idVimeo)) {

        // this.link = `https://player.vimeo.com/video/${this.idVimeo}?color=ffffff`
        this.link = `https://www.youtube.com/embed/${this.idVimeo}`
        this.titleVideo = this.title;
      }

    } catch (error) {
      console.log(error);
    }

  }


  isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value != 'null' &&
      value !== undefined) ? true : false;
  }


}
