import {Component, Input, OnInit} from '@angular/core';
import {Article} from '../../interfaces/interfaces';

import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ActionSheetController, Platform} from '@ionic/angular';
import {DataLocalService} from '../../services/data-local.service';

@Component({
    selector: 'app-noticia',
    templateUrl: './noticia.component.html',
    styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

    @Input() noticia: Article;
    @Input() indice: number;
    @Input() enFavoritos;

    constructor(private iab: InAppBrowser,
                private actionSheetCtrl: ActionSheetController,
                private socialSharing: SocialSharing,
                private dataLocalService: DataLocalService,
                private platform: Platform) {
    }

    ngOnInit() {
    }

    abrirNoticia() {
        const browser = this.iab.create(this.noticia.url, '_system');
    }

    async lanzarMenu() {


        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Compartir',
                    icon: 'share',
                    cssClass: 'action-dark',
                    handler: () => {
                        this.compartirNoticia();
                    }
                },
                {
                    text: this.enFavoritos ? 'Eliminar favorito' : 'Favorito',
                    icon: this.enFavoritos ? 'trash' : 'star',
                    cssClass: 'action-dark',
                    handler: () => {
                        if (this.enFavoritos) {
                            this.dataLocalService.borrarNoticia(this.noticia);
                        } else {
                            this.dataLocalService.guardarNoticia(this.noticia);
                        }
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close',
                    cssClass: 'action-dark',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
    }

    compartirNoticia() {

        if (this.platform.is('cordova')) {

            this.socialSharing.share(
                this.noticia.title,
                this.noticia.source.name,
                null,
                this.noticia.url
            );
        } else if (navigator['share']) {
            navigator['share']({
                title: this.noticia.title,
                text: this.noticia.description,
                url: this.noticia.url,
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            alert('Su dispositivo actual no soporta esta caracteristica');
        }
    }
}
