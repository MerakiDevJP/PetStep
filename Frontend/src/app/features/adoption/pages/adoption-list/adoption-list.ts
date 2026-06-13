import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-adoption-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './adoption-list.html',
    styleUrl: './adoption-list.scss'
})
export class AdoptionList implements OnInit {
    private http = inject(HttpClient); // ✅ inject en lugar de constructor

    solicitudes = signal<any[]>([]); // ✅ signal en lugar de array normal
    mensaje = signal('');            // ✅ signal

    ngOnInit() {
        this.cargarSolicitudes();
    }

    cargarSolicitudes() {
        this.http.get<any[]>('/api/adoptions').subscribe({
            next: (data) => this.solicitudes.set(data), // ✅ .set() actualiza el signal
            error: (err) => console.error('Error al cargar solicitudes:', err)
        });
    }

    isLoggedIn(): boolean {
        return true;
    }

    aprobar(id: string) {
        this.http.patch(`/api/adoptions/${id}/approve`, {}).subscribe({
            next: () => {
                this.mensaje.set('✅ Solicitud aprobada correctamente');
                this.solicitudes.update(list => list.filter(s => s._id !== id)); // ✅ .update()
            },
            error: (err) => {
                console.error('Error al aprobar:', err);
                this.mensaje.set('❌ Error al procesar la aprobación');
            }
        });
    }
}