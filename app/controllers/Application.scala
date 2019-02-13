package controllers

import play.api._
import play.api.mvc._
import play.api.cache.Cache
import play.api.Play.current
import play.api.libs.json.Json
import parser.SchemaParser
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import parser.schema.GraphQLSchema
import parser.exceptions.ParserError
import play.api.db._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index(null))
  }

  def validate = Action {
    request => {

      val parser = SchemaParser()
      var schema: Option[GraphQLSchema] = None
      var outp = Ok(Json.toJson(Map( "result" -> "" )))
      try {
        schema = Some(parser.parse(request.body.asJson.get match {
          case obj: JsObject => obj.value("input") match {
            case k: JsString => k.value
            case _ => ""
          }
          case _ => ""
        }))
        outp = Ok(Json.toJson(Map(
          "result" -> schema.get.format
        )))
      } catch {
        case err: ParserError[_] => outp = Ok(Json.toJson(Map(
          "error" -> err.getMessage
        )))
        case x: Throwable => outp = Ok(Json.toJson(Map(
          "error" -> x.getMessage
        )))
      }

      outp
    }
  }

}
