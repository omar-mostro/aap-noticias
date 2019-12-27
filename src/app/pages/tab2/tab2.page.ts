import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSegment} from '@ionic/angular';
import {Article, RespuestaTopHeadlines} from '../../interfaces/interfaces';
import {NoticiasService} from '../../services/noticias.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    @ViewChild(IonSegment, {static: true}) segment: IonSegment;

    categorias = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
    noticiasCategoria: Article[] = [];

    constructor(private noticiasService: NoticiasService) {
    }


    ngOnInit(): void {
        this.segment.value = this.categorias[0];
        this.cargarNoticias(this.categorias[0]);
    }

    private cargarNoticias(categoria: string, event?) {
        this.noticiasService.getTopHeadLinesCategory(categoria)
            .subscribe(resp => {

                this.noticiasCategoria.push(...resp.articles);

                if (resp.articles.length === 0) {
                    event.target.complete();
                    event.target.disabled = true;
                }
            });

        if (event) {
            event.target.complete();
        }
    }

    cargarMasNoticias(event: CustomEvent) {
        this.cargarNoticias(this.segment.value, event);
    }

    solicitarNuevaCategoria(event: CustomEvent) {

        this.noticiasCategoria = [];
        this.cargarNoticias(event.detail.value);
    }

}
