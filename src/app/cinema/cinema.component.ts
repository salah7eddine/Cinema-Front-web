import { Component, OnInit } from "@angular/core";
import { CinemaService } from "src/service/cinema.service";

@Component({
  selector: "app-cinema",
  templateUrl: "./cinema.component.html",
  styleUrls: ["./cinema.component.css"]
})
export class CinemaComponent implements OnInit {
  public listOfCity;
  public cinemas;
  public currentVille;
  public currentCinema;
  public salles;
  public ticketsApayer;
  public currentProjection;
  public selectedTickets = [];

  constructor(public cinemaService: CinemaService) {}

  ngOnInit() {
    this.cinemaService.getVilles().subscribe(
      data => {
        this.listOfCity = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  onGetCinemas(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v).subscribe(
      data => {
        this.cinemas = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c).subscribe(
      data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle).subscribe(
            data => {
              salle.projections = data;
            },
            err => {
              console.log(err);
            }
          );
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  onGetTicketsPlaces(p) {
    this.ticketsApayer = [];
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p).subscribe(
      data => {
        this.currentProjection.tickets = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  onSelectTicket(t) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }

  getTicketClass(t) {
    let str = "ticket btn ";
    if (t.reserve == true) {
      str += "btn-danger";
    } else if (t.selected) {
      str += "btn-warning";
    } else {
      str += "btn-success";
    }
    return str;
  }

  onPayTickets(dataForm) {
    let tickets = [];
    this.selectedTickets.forEach(t => {
      tickets.push(t.id);
    });
    dataForm.tickets = tickets;
    this.cinemaService.payerTickets(dataForm).subscribe(
      data => {
        alert("Tickets Réservés avec succès!");
        this.onGetTicketsPlaces(this.currentProjection);
        this.selectedTickets = [];
      },
      err => {
        console.log(err);
      }
    );
  }
}
