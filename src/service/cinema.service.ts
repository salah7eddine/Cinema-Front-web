import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CinemaService {
  public host: string = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  public getVilles() {
    return this.http.get(this.host + "/villes");
  }

  getCinemas(v) {
    return this.http.get(v._links.cinemas["href"]);
  }

  getSalles(c) {
    return this.http.get(c._links.salles.href);
  }
  getProjections(salle) {
    let url = salle._links.projectionFilms.href.replace(
      "{?projection}",
      "?projection=p1"
    );
    return this.http.get(url);
  }

  getTicketsPlaces(p) {
    let url = p._links.tickets.href.replace(
      "{?projection}",
      "?projection=ticketProj"
    );
    return this.http.get(url);
  }

  payerTickets(dataForm) {
    return this.http.post(this.host + "/payerTickets", dataForm);
  }
}
